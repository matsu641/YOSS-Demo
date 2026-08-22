# public.tenant

## Description

テナントテーブル

## Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
| ---- | ---- | ------- | -------- | -------- | ------- | ------- |
| tenant_id | varchar(64) |  | false | [public.contract](public.contract.md) [public.export_file](public.export_file.md) [public.information](public.information.md) [public.password_reset_requests](public.password_reset_requests.md) [public.region_resource_tenant_coinfig](public.region_resource_tenant_coinfig.md) [public.school](public.school.md) [public.user_passkeys](public.user_passkeys.md) [public.users](public.users.md) |  | テナントID |
| lock_count | smallint |  | true |  |  | ロック回数 |
| lock_release_time | smallint |  | true |  |  | ロック解除時間 |
| password_limit | smallint |  | true |  |  | パスワード有効期限 |
| password_policy | varchar(64) |  | true |  |  | パスワードポリシー |
| message | varchar(64) |  | true |  |  | エラーメッセージ |
| updated_at | timestamp without time zone |  | false |  |  | 更新日時 |
| registered_user_id | integer |  | false |  |  | 登録ユーザID |
| updated_user_id | integer |  | true |  |  | 更新ユーザID |
| no_operation_timeout | smallint |  | true |  |  | 無操作タイムアウト時間 |
| fapp_id | varchar(64) |  | true |  |  | フロントアプリID |
| fapp_userid | varchar(64) |  | true |  |  | フロントアプリユーザID |
| fapp_password | varchar(64) |  | true |  |  | フロントアプリパスワード |
| is_copy_enabled | boolean | false | true |  |  | コピー機能有効化 |
| personal_ip_address | varchar(200) |  | true |  |  | 個人情報保管IPアドレス |
| is_legacy_ui_enabled | boolean | false | true |  |  |  |
| is_otp_enabled | boolean | false | true |  |  |  |
| is_deleted | boolean | false | false |  |  |  |

## Constraints

| Name | Type | Definition |
| ---- | ---- | ---------- |
| tenanto_pkc | PRIMARY KEY | PRIMARY KEY (tenant_id) |

## Indexes

| Name | Definition |
| ---- | ---------- |
| tenanto_pkc | CREATE UNIQUE INDEX tenanto_pkc ON public.tenant USING btree (tenant_id) |

## Relations

```mermaid
erDiagram

"public.contract" }o--|| "public.tenant" : "Additional Relation"
"public.export_file" }o--|| "public.tenant" : "Additional Relation"
"public.information" }o--o| "public.tenant" : "Additional Relation"
"public.password_reset_requests" }o--|| "public.tenant" : "Additional Relation"
"public.region_resource_tenant_coinfig" |o--|| "public.tenant" : "Additional Relation"
"public.school" }o--o| "public.tenant" : "Additional Relation"
"public.user_passkeys" }o--|| "public.tenant" : "Additional Relation"
"public.users" }o--|| "public.tenant" : "Additional Relation"

"public.tenant" {
  varchar_64_ tenant_id
  smallint lock_count
  smallint lock_release_time
  smallint password_limit
  varchar_64_ password_policy
  varchar_64_ message
  timestamp_without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
  smallint no_operation_timeout
  varchar_64_ fapp_id
  varchar_64_ fapp_userid
  varchar_64_ fapp_password
  boolean is_copy_enabled
  varchar_200_ personal_ip_address
  boolean is_legacy_ui_enabled
  boolean is_otp_enabled
  boolean is_deleted
}
"public.contract" {
  integer contract_id
  varchar_64_ prefectures
  varchar_64_ municipality
  varchar_64_ tenant_id
  varchar_64_ contractor_name
  varchar_64_ contractor_name_kana
  timestamp_without_time_zone start_date
  timestamp_without_time_zone end_date
  varchar_64_ contract_manager
  varchar_64_ mail_address
  varchar_64_ contact_method
  timestamp_without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
}
"public.export_file" {
  varchar_64_ tenant_id
  varchar_1_ file_kbn
  integer status_code
  varchar_256_ file_path
  timestamp_6__without_time_zone create_file_datetime
  timestamp_6__without_time_zone updated_at
  integer updated_user_id
}
"public.information" {
  integer information_id
  varchar_256_ information
  timestamp_without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
  smallint information_type
  varchar_32_ school_code
  timestamp_without_time_zone registered_date
  varchar_128_ title
  varchar_64_ tenant_id
  timestamp_6__without_time_zone display_start_at
  timestamp_6__without_time_zone display_end_at
  boolean is_forced
}
"public.password_reset_requests" {
  integer request_id
  integer user_id FK
  varchar_64_ tenant_id
  smallint request_status
  timestamp_6__without_time_zone requested_at
  timestamp_6__without_time_zone processed_at
  integer processed_by_user_id
}
"public.region_resource_tenant_coinfig" {
  varchar_64_ tenant_id
  varchar_1_ scope
  boolean usage_flag
  timestamp_6__without_time_zone registered_at
  timestamp_6__without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
}
"public.school" {
  varchar_64_ school_name
  varchar_32_ school_code
  varchar_32_ prefectures
  varchar_64_ municipalities
  varchar_32_ classification
  varchar_64_ tenant_id
  timestamp_6__without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
}
"public.user_passkeys" {
  bigint id
  integer user_id FK
  varchar_64_ tenant_id
  varchar_1024_ credential_id
  text public_key
  timestamp_without_time_zone created_at
  varchar_255_ device_name
}
"public.users" {
  integer user_id
  varchar_64_ login_id
  varchar_64_ user_name
  varchar_64_ mail
  varchar_128_ password
  smallint author
  boolean is_temporary_password
  varchar_64_ tenant_id
  smallint retry_count
  timestamp_without_time_zone login_at
  timestamp_without_time_zone update_password_at
  timestamp_without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
  varchar_64_ phone_number
  smallint mask_type
  boolean is_deleted
  timestamp_without_time_zone deleted_at
  integer deleted_user_id
}
```

---

> Generated by [tbls](https://github.com/k1LoW/tbls)
