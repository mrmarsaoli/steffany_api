import { Migration } from '@mikro-orm/migrations';

export class Migration20210206122014 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `email` varchar not null, `password` text not null);');
    this.addSql('create unique index `user_email_unique` on `user` (`email`);');
  }

}
