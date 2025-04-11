CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_parent_tasks` AS
    SELECT 
        `hrproject`.`b_parent_tasks`.`task_id` AS `task_id`,
        `hrproject`.`b_parent_tasks`.`task_name` AS `task_name`,
        `hrproject`.`b_parent_tasks`.`task_description` AS `task_description`,
        `hrproject`.`b_parent_tasks`.`task_group_id` AS `task_group_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('task_group',
                `hrproject`.`b_parent_tasks`.`task_group_id`) AS `task_group`,
        `hrproject`.`b_parent_tasks`.`created_date` AS `created_date`,
        `hrproject`.`b_parent_tasks`.`last_updated_date` AS `last_updated_date`,
        `hrproject`.`b_parent_tasks`.`enabled` AS `enabled`
    FROM
        `hrproject`.`b_parent_tasks`