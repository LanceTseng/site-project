CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_eqpt_occupied_his` AS
    SELECT 
        `h`.`id` AS `id`,
        `h`.`equipment_id` AS `equipment_id`,
        GET_EQUIPMENT_NAME_FN(`h`.`equipment_id`) AS `equipment_name`,
        `h`.`occupied_by` AS `occupied_by`,
        GET_USER_NAME_FN(`h`.`occupied_by`) AS `occupied_by_name`,
        `h`.`occupied_date` AS `occupied_date`,
        `h`.`released_date` AS `released_date`,
        `h`.`occupied_task_id` AS `occupied_task_id`,
        GET_TASK_NAME_BY_LINE_FN(`h`.`occupied_task_id`) AS `occupied_task_name`,
        `h`.`released_task_id` AS `released_task_id`,
        GET_TASK_NAME_BY_LINE_FN(`h`.`released_task_id`) AS `released_task_name`
    FROM
        `hrproject`.`b_eqpt_occupied_his` `h`