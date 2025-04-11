CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_user_training` AS
    SELECT 
        `hrproject`.`rel_user_training`.`id` AS `id`,
        `hrproject`.`rel_user_training`.`user_id` AS `user_id`,
        GET_USER_NAME_FN(`hrproject`.`rel_user_training`.`user_id`) AS `user_name`,
        `hrproject`.`rel_user_training`.`training_module_id` AS `training_module_id`,
        `hrproject`.`b_training_modules`.`training_module_name` AS `training_module_name`,
        `hrproject`.`b_training_modules`.`training_module_description` AS `training_module_description`,
        `hrproject`.`b_training_modules`.`training_department_id` AS `training_department_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('training_department',
                `hrproject`.`b_training_modules`.`training_department_id`) AS `training_department`,
        `hrproject`.`rel_user_training`.`status` AS `status`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('training_status',
                `hrproject`.`rel_user_training`.`status`) AS `training_status`,
        `hrproject`.`rel_user_training`.`verified_by` AS `verified_by`,
        GET_USER_NAME_FN(`hrproject`.`rel_user_training`.`verified_by`) AS `verified_name`,
        `hrproject`.`rel_user_training`.`link_user_childtask_id` AS `user_ct_line_id`,
        GET_TASK_NAME_BY_LINE_FN(`hrproject`.`rel_user_training`.`link_user_childtask_id`) AS `task_name`,
        `hrproject`.`rel_user_training`.`start_date` AS `start_date`,
        `hrproject`.`rel_user_training`.`end_date` AS `end_date`,
        `hrproject`.`rel_user_training`.`created_date` AS `created_date`,
        `hrproject`.`rel_user_training`.`updated_date` AS `updated_date`
    FROM
        (`hrproject`.`rel_user_training`
        LEFT JOIN `hrproject`.`b_training_modules` ON ((`hrproject`.`rel_user_training`.`training_module_id` = `hrproject`.`b_training_modules`.`training_module_id`)))