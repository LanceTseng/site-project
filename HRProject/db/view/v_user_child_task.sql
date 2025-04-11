CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_user_child_task` AS
    SELECT 
        `hrproject`.`rel_user_childtask`.`id` AS `line_id`,
        `hrproject`.`rel_user_childtask`.`user_parenttask_id` AS `user_parenttask_id`,
        GET_USER_TASK_USER_ID_BY_ID_FN(`hrproject`.`rel_user_childtask`.`user_parenttask_id`) AS `user_id`,
        `hrproject`.`rel_user_childtask`.`child_task_id` AS `child_task_id`,
        GET_CHILD_TASK_NAME_FN(`hrproject`.`rel_user_childtask`.`child_task_id`) AS `ct_task_name`,
        GET_CHILD_TASK_DESC_FN(`hrproject`.`rel_user_childtask`.`child_task_id`) AS `ct_desc`,
        `hrproject`.`rel_user_childtask`.`status` AS `ct_status`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('user_child_taks_status',
                `hrproject`.`rel_user_childtask`.`status`) AS `ct_status_name`,
        `hrproject`.`rel_user_childtask`.`document_id` AS `document_id`,
        `hrproject`.`rel_user_childtask`.`document_path` AS `document_path`,
        GET_DOCUMENT_NAME_FN(`hrproject`.`rel_user_childtask`.`document_id`) AS `document_name`,
        `hrproject`.`rel_user_childtask`.`require_upload` AS `require_upload`,
        `hrproject`.`rel_user_childtask`.`training_module_id` AS `training_module_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('training_department',
                `hrproject`.`rel_user_childtask`.`training_module_id`) AS `training_module_dept_name`,
        `hrproject`.`rel_user_childtask`.`equipment_type_id` AS `equipment_type_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('equipment_type',
                `hrproject`.`rel_user_childtask`.`equipment_type_id`) AS `eqpt_type_name`,
        `hrproject`.`rel_user_childtask`.`equipment_id` AS `equipment_id`,
        GET_EQUIPMENT_CODE_FN(`hrproject`.`rel_user_childtask`.`equipment_id`) AS `eqpt_code`,
        GET_EQUIPMENT_NAME_FN(`hrproject`.`rel_user_childtask`.`equipment_id`) AS `eqpt_name`,
        `hrproject`.`rel_user_childtask`.`acess_provisioning_id` AS `acess_provisioning_id`,
        `hrproject`.`rel_user_childtask`.`interview_id` AS `interview_id`,
        `hrproject`.`rel_user_childtask`.`survey_id` AS `survey_id`,
        GET_FORM_NAME_FN(`hrproject`.`rel_user_childtask`.`survey_id`) AS `survey_name`,
        `hrproject`.`rel_user_childtask`.`hand_over_id` AS `hand_over_id`,
        `hrproject`.`rel_user_childtask`.`start_date` AS `ct_start_date`,
        `hrproject`.`rel_user_childtask`.`end_date` AS `ct_end_date`,
        `hrproject`.`rel_user_childtask`.`created_date` AS `created_date`,
        `hrproject`.`rel_user_childtask`.`last_updated_date` AS `last_updated_date`
    FROM
        `hrproject`.`rel_user_childtask`