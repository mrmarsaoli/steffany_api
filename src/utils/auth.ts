import 'dotenv/config'
import { Response } from 'express'
import { sign } from 'jsonwebtoken'
import { User } from '../entities/user/User'

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15m'
  })
}

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '3d' }
  )
}

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie(process.env.COOKIE_NAME as string, token, {
    sameSite: 'lax',
    httpOnly: true
  })
}
