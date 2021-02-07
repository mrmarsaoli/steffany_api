import { Migration } from '@mikro-orm/migrations';

export class Migration20210206200808 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `email` varchar not null, `password` text not null, `token_version` integer not null default 0);');
    this.addSql('create unique index `user_email_unique` on `user` (`email`);');

    this.addSql('create table `shift` (`id` integer not null primary key autoincrement, `name` varchar not null, `start` datetime not null, `end` datetime not null, `created` datetime not null, `updated` datetime not null, `published` integer not null default 0);');

    this.addSql('alter table `shift` add column `user` integer null;');
    this.addSql('create index `shift_user_index` on `shift` (`user`);');
  }

}
