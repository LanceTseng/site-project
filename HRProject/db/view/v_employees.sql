CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_employees` AS
    SELECT 
        `b`.`employee_id` AS `employee_id`,
        `b`.`first_name` AS `first_name`,
        `b`.`last_name` AS `last_name`,
        `b`.`department_id` AS `department_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('department', `b`.`department_id`) AS `department_name`,
        `b`.`status` AS `status`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('employee_status', `b`.`status`) AS `status_name`,
        `b`.`address` AS `address`,
        `b`.`phone` AS `phone`,
        `b`.`is_active` AS `is_active`,
        `b`.`created_date` AS `created_date`,
        `b`.`last_updated_date` AS `last_updated_date`,
        `b`.`link_user_id` AS `link_user_id`
    FROM
        `hrproject`.`b_employees` `b`