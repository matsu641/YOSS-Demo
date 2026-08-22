# public.school

## Description

学校テーブル

## Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
| ---- | ---- | ------- | -------- | -------- | ------- | ------- |
| school_name | varchar(64) |  | false |  |  | 学校名 |
| school_code | varchar(32) |  | false | [public.active_semester_setting](public.active_semester_setting.md) [public.users_school](public.users_school.md) [public.class](public.class.md) [public.class_daito](public.class_daito.md) [public.information](public.information.md) [public.proceedings](public.proceedings.md) [public.school_response_flag](public.school_response_flag.md) [public.school_setting](public.school_setting.md) [public.semester](public.semester.md) |  | 学校コード |
| prefectures | varchar(32) |  | false |  |  | 都道府県 |
| municipalities | varchar(64) |  | false |  |  | 市区町村 |
| classification | varchar(32) |  | false |  |  | 学校区分 |
| tenant_id | varchar(64) |  | true |  | [public.tenant](public.tenant.md) | テナントID |
| updated_at | timestamp(6) without time zone |  | true |  |  | 更新日時 |
| registered_user_id | integer |  | true |  |  | 登録ユーザID |
| updated_user_id | integer |  | true |  |  | 更新ユーザID |

## Constraints

| Name | Type | Definition |
| ---- | ---- | ---------- |
| school_pkc | PRIMARY KEY | PRIMARY KEY (school_code) |

## Indexes

| Name | Definition |
| ---- | ---------- |
| school_pkc | CREATE UNIQUE INDEX school_pkc ON public.school USING btree (school_code) |

## Relations

```mermaid
erDiagram

"public.active_semester_setting" |o--|| "public.school" : "FOREIGN KEY (school_code) REFERENCES school(school_code)"
"public.users_school" }o--|| "public.school" : "Additional Relation"
"public.class" }o--|| "public.school" : "Additional Relation"
"public.class_daito" }o--|| "public.school" : "Additional Relation"
"public.information" }o--o| "public.school" : "Additional Relation"
"public.proceedings" }o--|| "public.school" : "Additional Relation"
"public.school_response_flag" }o--|| "public.school" : "Additional Relation"
"public.school_setting" }o--|| "public.school" : "Additional Relation"
"public.semester" }o--|| "public.school" : "Additional Relation"
"public.school" }o--o| "public.tenant" : "Additional Relation"

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
"public.active_semester_setting" {
  varchar_32_ school_code FK
  timestamp_without_time_zone setting_start_at
  integer registered_user_id
}
"public.users_school" {
  integer user_id
  varchar_32_ school_code
  timestamp_6__without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
}
"public.class" {
  integer class_id
  varchar_32_ school_code
  smallint year
  varchar_32_ grade
  varchar_32_ class_name
  smallint number
  integer pupil_id
  varchar_32_ next_grade
  varchar_32_ next_class
  smallint next_number
  varchar_32_ school_continuance_code
  varchar_32_ transfer_school_code
  timestamp_without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
  smallint pupil_type
  boolean pupil_accept_flag
}
"public.class_daito" {
  integer class_id
  varchar_32_ school_code
  smallint year
  varchar_32_ grade
  varchar_32_ class_name
  smallint number
  integer pupil_id
  varchar_32_ next_grade
  varchar_32_ next_class
  smallint next_number
  varchar_32_ school_continuance_code
  varchar_32_ transfer_school_code
  timestamp_6__without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
  smallint pupil_type
  boolean pupil_accept_flag
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
"public.proceedings" {
  integer proceedings_id
  varchar_64_ school_code
  integer pupil_id
  integer semester_id
  timestamp_6__without_time_zone registered_at
  timestamp_6__without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
}
"public.school_response_flag" {
  integer flag_id
  varchar_32_ school_code
  smallint sort_order
  varchar_32_ flag_name
  varchar_256_ flag_label
  varchar_16_ flag_color
  boolean is_active
  timestamp_6__without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
}
"public.school_setting" {
  varchar_32_ school_code
  varchar_64_ item_name_1
  varchar_256_ comment_1
  varchar_64_ item_name_2
  varchar_256_ comment_2
  varchar_64_ item_name_3
  varchar_256_ comment_3
  varchar_64_ item_name_4
  varchar_256_ comment_4
  varchar_64_ item_name_5
  varchar_256_ comment_5
  varchar_64_ item_name_6
  varchar_256_ comment_6
  varchar_64_ item_name_7
  varchar_256_ comment_7
  varchar_64_ item_name_8
  varchar_256_ comment_8
  varchar_64_ item_name_9
  varchar_256_ comment_9
  varchar_64_ item_name_10
  varchar_256_ comment_10
  varchar_64_ item_name_11
  varchar_256_ comment_11
  varchar_64_ item_name_12
  varchar_256_ comment_12
  varchar_64_ item_name_13
  varchar_256_ comment_13
  varchar_64_ item_name_14
  varchar_256_ comment_14
  varchar_64_ item_name_15
  varchar_256_ comment_15
  timestamp_without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
  varchar_32_ last_grade
  varchar_64_ grade_1
  varchar_64_ grade_2
  varchar_64_ grade_3
  varchar_64_ grade_4
  varchar_64_ grade_5
  varchar_64_ grade_6
  varchar_64_ grade_7
  varchar_64_ grade_8
  varchar_64_ grade_9
  varchar_64_ grade_10
  varchar_64_ grade_11
  varchar_64_ grade_12
  varchar_512_ resource_map_embed_url
  varchar_512_ resource_map_edit_url
}
"public.semester" {
  integer semester_id
  varchar_32_ school_code
  smallint year
  varchar_32_ semester
  timestamp_without_time_zone reference_date
  timestamp_without_time_zone updated_at
  integer registered_user_id
  integer updated_user_id
}
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
```

---

> Generated by [tbls](https://github.com/k1LoW/tbls)
