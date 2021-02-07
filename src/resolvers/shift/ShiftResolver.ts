import { QueryOrder } from '@mikro-orm/core'
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql'
import { Shift } from '../../entities/shift/Shift'
import { isAuth } from '../../middlewares/isAuth'
import { FieldError, InputOptions, ResolverContext } from '../../types'
import {
  CreateShiftInput,
  ShiftResponse,
  ShiftListInput,
  ShiftListResponse,
  DeleteShiftResponse,
  EditShiftInput,
  PublishShiftResponse,
  BulkingError
} from '../../types/shiftTypes'
import { Log } from '../../utils/log'

@Resolver(Shift)
export class ShiftResolver {
  /**
   * List of shifts
   */
  @UseMiddleware(isAuth)
  @Query(() => ShiftListResponse)
  async shifts(
    @Arg('params') params: ShiftListInput,
    @Ctx() { em, payload }: ResolverContext
  ): Promise<ShiftListResponse> {
    const userId = Number(payload!.userId)

    if (!userId) {
      return {
        error: {
          field: 'user',
          message: 'you are not allowed to see these shifts'
        }
      }
    }
    const args: ShiftListInput = {}
    const options: InputOptions = {}
    const optionsIndex: any[] = ['limit', 'offset']
    const orderIndex: any[] = ['orderBy', 'desc']

    for (const key in params) {
      if (orderIndex.includes(key)) {
        continue
      }

      if (optionsIndex.includes(key)) {
        options[key] = params[key]
        continue
      }

      args[key] = params[key]
    }

    const order = params.desc ? QueryOrder.DESC : QueryOrder.ASC

    const shifts = await em.find(Shift, args, {
      ...options,
      orderBy: { [params.orderBy as any]: order },
      populate: ['user']
    })

    return { shifts }
  }

  /**
   * Create a shift
   * @param params
   */
  @UseMiddleware(isAuth)
  @Mutation(() => ShiftResponse)
  async createShift(
    @Arg('params') params: CreateShiftInput,
    @Ctx() { em, payload }: ResolverContext
  ): Promise<ShiftResponse> {
    const errors: FieldError[] = []

    const userId = Number(payload!.userId)

    if (!userId) {
      errors.push({
        field: 'user',
        message: 'you are not allowed to create a shift'
      })
    }

    if (params.name.length <= 2) {
      errors.push({
        field: 'name',
        message: 'Name has to be more than 2 characters'
      })
    }

    if (errors.length) {
      return { errors }
    }

    const shift = em.create(Shift, { ...params })

    try {
      await em.persistAndFlush(shift)
    } catch (err) {
      Log(err)
      return {
        errors: [
          {
            field: 'general',
            message: 'something unexpected happen'
          }
        ]
      }
    }

    return { shift, errors }
  }

  /**
   * Edit a shift
   * @param params
   */
  @UseMiddleware(isAuth)
  @Mutation(() => ShiftResponse)
  async editShift(
    @Arg('params') params: EditShiftInput,
    @Ctx() { em, payload }: ResolverContext
  ): Promise<ShiftResponse> {
    const errors: FieldError[] = []

    const userId = Number(payload!.userId)

    if (!userId) {
      errors.push({
        field: 'user',
        message: 'you are not allowed to create a shift'
      })
    }

    if (params.name.length <= 2) {
      errors.push({
        field: 'name',
        message: 'name has to be more than 2 characters'
      })
    }

    if (errors.length) {
      return { errors }
    }

    const shift = await em.findOne(Shift, { id: params.id })

    if (!shift) {
      return {
        errors: [
          {
            field: 'shift',
            message: `shift doesn't exist`
          }
        ]
      }
    }

    if (shift.user.id !== userId) {
      return {
        errors: [
          {
            field: 'shift',
            message: `you can only edit your own shift`
          }
        ]
      }
    }

    if (shift.published) {
      return {
        errors: [
          {
            field: 'shift',
            message: 'you can not edit a published shift'
          }
        ]
      }
    }

    shift.name = params.name
    shift.start = params.start
    shift.end = params.end

    try {
      await em.persistAndFlush(shift)
    } catch (err) {
      Log(err)
      return {
        errors: [
          {
            field: 'general',
            message: 'something unexpected happen'
          }
        ]
      }
    }

    return { shift, errors }
  }

  /**
   * Delete a shift
   * @param id
   */
  @UseMiddleware(isAuth)
  @Mutation(() => DeleteShiftResponse)
  async deleteShift(
    @Arg('id', () => Int) id: number,
    @Ctx() { em, payload }: ResolverContext
  ): Promise<DeleteShiftResponse> {
    const userId = Number(payload!.userId)

    if (!userId) {
      return {
        error: {
          field: 'user',
          message: 'you are not allowed to delete this shift'
        }
      }
    }

    const shift = await em.findOne(Shift, { id })

    if (!shift) {
      return {
        error: {
          field: 'shift',
          message: 'shift does not exist'
        }
      }
    }

    if (shift.user.id !== userId) {
      return {
        error: {
          field: 'user',
          message: 'you can only delete your own shift'
        }
      }
    }

    if (shift.published) {
      return {
        error: {
          field: 'shift',
          message: 'you can not delete a published shift'
        }
      }
    }

    await em.nativeDelete(Shift, { id })

    return { deleted: true }
  }

  /**
   * Publish shift
   * @param ids
   */
  @UseMiddleware(isAuth)
  @Mutation(() => PublishShiftResponse)
  async publishShift(
    @Arg('ids', () => [Int]) ids: number[],
    @Ctx() { em, payload }: ResolverContext
  ): Promise<PublishShiftResponse> {
    const bulkingErrors: BulkingError[] = []

    const userId = Number(payload!.userId)

    if (!userId) {
      return {
        error: {
          field: 'user',
          message: 'you are not allowed to publish these shifts'
        },
        bulkingErrors,
        success: false
      }
    }

    const shifts = await em.find(Shift, { id: ids })

    shifts.forEach(async (item) => {
      if (item.user.id !== userId) {
        bulkingErrors.push({
          id: item.id,
          field: 'user',
          message: 'you can only published your own shift'
        })

        return
      }

      item.published = 1

      try {
        await em.persistAndFlush(item)
      } catch (err) {
        Log(err)
        bulkingErrors.push({
          id: item.id,
          field: 'general',
          message: 'something unexpected happen'
        })
      }
    })

    const success = bulkingErrors.length === 0

    return {
      bulkingErrors,
      success
    }
  }
}
