CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_user_employee` AS
    SELECT 
        `hrproject`.`b_users`.`user_id` AS `user_id`,
        `hrproject`.`b_users`.`username` AS `username`,
        `hrproject`.`b_users`.`password` AS `password`,
        `hrproject`.`b_users`.`role_id` AS `role_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('user_role',
                `hrproject`.`b_users`.`role_id`) AS `user_role`,
        `hrproject`.`b_users`.`is_active` AS `u_is_active`,
        `hrproject`.`b_users`.`created_date` AS `u_created_date`,
        `hrproject`.`b_users`.`last_updated_date` AS `u_updated_date`,
        `hrproject`.`b_employees`.`employee_id` AS `employee_id`,
        `hrproject`.`b_employees`.`first_name` AS `first_name`,
        `hrproject`.`b_employees`.`last_name` AS `last_name`,
        `hrproject`.`b_employees`.`department_id` AS `department_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('department',
                `hrproject`.`b_employees`.`department_id`) AS `department_name`,
        `hrproject`.`b_employees`.`status` AS `status`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('employee_status',
                `hrproject`.`b_employees`.`status`) AS `status_name`,
        `hrproject`.`b_employees`.`address` AS `address`,
        `hrproject`.`b_employees`.`phone` AS `phone`,
        `hrproject`.`b_employees`.`onboard_date` AS `onboard_date`,
        `hrproject`.`b_employees`.`offboard_date` AS `offboard_date`,
        `hrproject`.`b_employees`.`is_active` AS `e_is_active`,
        `hrproject`.`b_employees`.`created_date` AS `e_created_date`,
        `hrproject`.`b_employees`.`last_updated_date` AS `e_last_updated_date`
    FROM
        (`hrproject`.`b_users`
        LEFT JOIN `hrproject`.`b_employees` ON ((`hrproject`.`b_users`.`user_id` = `hrproject`.`b_employees`.`link_user_id`)))