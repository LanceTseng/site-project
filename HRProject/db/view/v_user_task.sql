CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_user_task` AS
    SELECT 
        `hrproject`.`v_user_parent_task`.`head_id` AS `head_id`,
        `hrproject`.`v_user_parent_task`.`user_id` AS `user_id`,
        `hrproject`.`v_user_parent_task`.`user_name` AS `user_name`,
        `hrproject`.`v_user_parent_task`.`parent_task_id` AS `parent_task_id`,
        `hrproject`.`v_user_parent_task`.`task_group_id` AS `pt_group_id`,
        `hrproject`.`v_user_parent_task`.`task_group_name` AS `pt_group_name`,
        `hrproject`.`v_user_parent_task`.`pt_name` AS `pt_name`,
        `hrproject`.`v_user_parent_task`.`pt_status` AS `pt_status`,
        `hrproject`.`v_user_parent_task`.`pt_status_name` AS `pt_status_name`,
        `hrproject`.`v_user_parent_task`.`count_child_tasks` AS `count_child_tasks`,
        `hrproject`.`v_user_parent_task`.`pt_start_date` AS `start_date`,
        `hrproject`.`v_user_parent_task`.`pt_end_date` AS `end_date`,
        `hrproject`.`v_user_child_task`.`line_id` AS `line_id`,
        `hrproject`.`v_user_child_task`.`child_task_id` AS `child_task_id`,
        `hrproject`.`v_user_child_task`.`ct_task_name` AS `ct_name`,
        `hrproject`.`v_user_child_task`.`ct_status` AS `ct_status`,
        `hrproject`.`v_user_child_task`.`ct_status_name` AS `ct_status_name`,
        `hrproject`.`v_user_child_task`.`document_id` AS `document_id`,
        `hrproject`.`v_user_child_task`.`document_name` AS `document_name`,
        `hrproject`.`v_user_child_task`.`document_path` AS `document_path`,
        `hrproject`.`v_user_child_task`.`require_upload` AS `require_upload`,
        `hrproject`.`v_user_child_task`.`training_module_id` AS `training_module_id`,
        `hrproject`.`v_user_child_task`.`training_module_dept_name` AS `training_module_dept_name`,
        `hrproject`.`v_user_child_task`.`equipment_type_id` AS `equipment_type_id`,
        `hrproject`.`v_user_child_task`.`eqpt_type_name` AS `eqpt_type_name`,
        `hrproject`.`v_user_child_task`.`equipment_id` AS `equipment_id`,
        `hrproject`.`v_user_child_task`.`eqpt_code` AS `eqpt_code`,
        `hrproject`.`v_user_child_task`.`eqpt_name` AS `eqpt_name`,
        `hrproject`.`v_user_child_task`.`acess_provisioning_id` AS `acess_provisioning_id`,
        `hrproject`.`v_user_child_task`.`interview_id` AS `interview_id`,
        `hrproject`.`v_user_child_task`.`survey_id` AS `survey_id`,
        `hrproject`.`v_user_child_task`.`survey_name` AS `survey_name`,
        `hrproject`.`v_user_child_task`.`hand_over_id` AS `hand_over_id`,
        `hrproject`.`v_user_child_task`.`ct_start_date` AS `ct_start_date`,
        `hrproject`.`v_user_child_task`.`ct_end_date` AS `ct_end_date`
    FROM
        (`hrproject`.`v_user_parent_task`
        LEFT JOIN `hrproject`.`v_user_child_task` ON ((`hrproject`.`v_user_parent_task`.`head_id` = `hrproject`.`v_user_child_task`.`user_parenttask_id`)))
    ORDER BY `hrproject`.`v_user_parent_task`.`user_name` , `hrproject`.`v_user_parent_task`.`pt_name` , `hrproject`.`v_user_child_task`.`ct_task_name` , `hrproject`.`v_user_parent_task`.`created_date`