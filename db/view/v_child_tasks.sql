CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_child_tasks` AS
    SELECT 
        `c`.`child_task_id` AS `child_task_id`,
        `c`.`parent_task_id` AS `parent_task_id`,
        `c`.`child_task_name` AS `child_task_name`,
        `c`.`child_task_description` AS `child_task_description`,
        `c`.`document_id` AS `document_id`,
        `d`.`document_name` AS `document_name`,
        `d`.`require_upload` AS `require_upload`,
        `c`.`training_module_id` AS `training_module_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('training_department',
                `c`.`training_module_id`) AS `training_module_dept_name`,
        `c`.`equipment_type_id` AS `equipment_type_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('equipment_type',
                `c`.`equipment_type_id`) AS `eqpt_type`,
        `c`.`access_provisioning_id` AS `access_provisioning_id`,
        `c`.`interview_id` AS `interview_id`,
        `c`.`survey_id` AS `survey_id`,
        GET_FORM_NAME_FN(`c`.`survey_id`) AS `servey_name`,
        `c`.`hand_over_id` AS `hand_over_id`,
        `c`.`enabled` AS `enabled`
    FROM
        (`hrproject`.`b_child_tasks` `c`
        LEFT JOIN `hrproject`.`b_documents` `d` ON ((`d`.`document_id` = `c`.`document_id`)))