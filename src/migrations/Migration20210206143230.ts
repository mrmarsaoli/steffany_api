import { Migration } from '@mikro-orm/migrations';

export class Migration20210206143230 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add column `token_version` integer null default 0;');
  }

}
