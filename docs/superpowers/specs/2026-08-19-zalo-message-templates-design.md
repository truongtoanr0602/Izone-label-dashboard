# Zalo Message Templates per Teacher

## Purpose

Allow a teacher to maintain multiple personal Zalo message templates and use
one while copying a message to a student. Templates make the wording more
natural while keeping the existing contact-log workflow intact.

## Decisions

- Templates are stored in Postgres and owned by `teacher_id`; they are never
  shared between users.
- A template belongs to exactly one contact trigger:
  `habit_reminder`, `red_followup`, or `relearn_advice`.
- The current hard-coded scripts remain read-only system templates and are the
  fallback when a teacher has no saved template or removes the selected one.
- Teachers create, edit, and delete their own templates from the existing
  Zalo reminder modal. A new template starts blank and can contain any text.
- `{{ten}}` always renders the student's complete `fullName`. No nickname or
  name-part inference is introduced; teachers may adjust copied text before
  sending when needed.
- Supported placeholders are `{{ten}}`, `{{lop}}`, `{{giao_vien}}`,
  `{{di_hoc}}`, `{{btvn}}`, and `{{diem_tb}}`. Missing data renders as `—`.
  Unsupported placeholders prevent saving, so a literal unresolved token is
  never copied accidentally.
- Missing attendance or homework placeholders produces a warning only. The
  teacher may still save and use the template. The original system scripts
  keep their existing attendance/homework guarantee for the contact-coverage
  business rule.
- Copying a template does not create, change, or remove a contact log. The
  existing explicit “Da lien he” action remains the only contact-log write.

## Data and API

Create `message_templates` with a bigint primary key, `teacher_id` foreign key,
template `name`, `trigger_type`, `body`, and timestamps. Enforce valid trigger
values in SQL and index `(teacher_id, trigger_type)`.

The authenticated API is:

- `GET /api/message-templates?triggerType=` — current teacher's templates.
- `POST /api/message-templates` — creates a template for the current teacher.
- `PATCH /api/message-templates/:id` — updates a template only when it belongs
  to the current teacher.
- `DELETE /api/message-templates/:id` — deletes a template only when it belongs
  to the current teacher.

The client never sends `teacherId`; the backend takes it from `CurrentUser`.
Requests with an invalid trigger, blank name/body, oversized content, or an
unsupported placeholder return a validation error. Accessing another user's
template returns not found rather than exposing ownership.

## Dashboard behaviour

`App` loads templates for the signed-in teacher and owns CRUD state. The Zalo
modal receives templates and callbacks, shows the system script plus templates
for the active trigger, and uses a single pure renderer for preview and
clipboard. Selecting a different trigger resets selection to the system script.
Deleting the active custom template also resets it to the system script.

The editor lists the supported placeholders, previews any missing metric as
`—`, shows an inline warning when either `{{di_hoc}}` or `{{btvn}}` is absent,
and still allows saving in that case.

## Verification

- Unit tests cover rendering supported variables, `—` for missing metrics,
  detection of unknown placeholders, and the data-completeness warning.
- Backend service tests cover owner-scoped list/create/update/delete and reject
  access to another teacher's template.
- Existing `messageScripts.test.ts` continues to prove system scripts include
  attendance and homework.
- Dashboard typecheck, lint, tests, build, and backend build are run. The
  pre-existing three `kpiFormat.test.ts` failures are reported separately and
  not changed by this feature.
