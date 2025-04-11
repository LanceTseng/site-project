CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_user_parent_task` AS
    SELECT 
        `hrproject`.`rel_user_parenttask`.`id` AS `head_id`,
        `hrproject`.`rel_user_parenttask`.`user_id` AS `user_id`,
        GET_USER_NAME_FN(`hrproject`.`rel_user_parenttask`.`user_id`) AS `user_name`,
        `hrproject`.`rel_user_parenttask`.`parent_task_id` AS `parent_task_id`,
        GET_TASK_GROUP_ID_FN(`hrproject`.`rel_user_parenttask`.`parent_task_id`) AS `task_group_id`,
        GET_TASK_GROUP_NAME_FN(`hrproject`.`rel_user_parenttask`.`parent_task_id`) AS `task_group_name`,
        GET_PARENT_TASK_NAME_FN(`hrproject`.`rel_user_parenttask`.`parent_task_id`) AS `pt_name`,
        GET_PARENT_TASK_DESC_FN(`hrproject`.`rel_user_parenttask`.`parent_task_id`) AS `pt_desc`,
        `hrproject`.`rel_user_parenttask`.`status` AS `pt_status`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('user_parent_taks_status',
                `hrproject`.`rel_user_parenttask`.`status`) AS `pt_status_name`,
        GET_PROCESSING_RATE_FN(`hrproject`.`rel_user_parenttask`.`id`) AS `processing_rate`,
        `hrproject`.`rel_user_parenttask`.`count_child_tasks` AS `count_child_tasks`,
        `hrproject`.`rel_user_parenttask`.`start_date` AS `pt_start_date`,
        `hrproject`.`rel_user_parenttask`.`end_date` AS `pt_end_date`,
        `hrproject`.`rel_user_parenttask`.`created_date` AS `created_date`,
        `hrproject`.`rel_user_parenttask`.`last_updated_date` AS `last_updated_date`
    FROM
        `hrproject`.`rel_user_parenttask`
    ORDER BY `hrproject`.`rel_user_parenttask`.`user_id` , `hrproject`.`rel_user_parenttask`.`created_date`