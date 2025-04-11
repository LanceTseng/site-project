CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_user_payment` AS
    SELECT 
        `bup`.`id` AS `payment_id`,
        `hrproject`.`vue`.`user_id` AS `user_id`,
        `hrproject`.`vue`.`username` AS `employee_username`,
        `hrproject`.`vue`.`first_name` AS `employee_first_name`,
        `hrproject`.`vue`.`last_name` AS `employee_last_name`,
        `hrproject`.`vue`.`department_id` AS `department_id`,
        `hrproject`.`vue`.`department_name` AS `department_name`,
        `hrproject`.`vue`.`status` AS `employee_status`,
        `hrproject`.`vue`.`status_name` AS `employee_status_name`,
        `bup`.`payment_type_id` AS `payment_type_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('payment_type', `bup`.`payment_type_id`) AS `payment_type_name`,
        `bup`.`annual_pay` AS `annual_salary`,
        `bup`.`work_hours_per_week` AS `weekly_work_hours`,
        `bup`.`terminal_pay` AS `termination_pay`,
        `bup`.`created_date` AS `created_at`,
        `bup`.`last_updated_date` AS `updated_at`
    FROM
        (`hrproject`.`v_user_employee` `vue`
        LEFT JOIN `hrproject`.`rel_user_payment` `bup` ON ((`bup`.`user_id` = `hrproject`.`vue`.`user_id`)))