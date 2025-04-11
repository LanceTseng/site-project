CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_training_modules` AS
    SELECT 
        `hrproject`.`b_training_modules`.`training_module_id` AS `training_module_id`,
        `hrproject`.`b_training_modules`.`training_module_name` AS `training_module_name`,
        `hrproject`.`b_training_modules`.`training_module_description` AS `training_module_description`,
        `hrproject`.`b_training_modules`.`training_department_id` AS `training_department_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('training_department',
                `hrproject`.`b_training_modules`.`training_department_id`) AS `training_department_name`,
        `hrproject`.`b_training_modules`.`enabled` AS `enabled`
    FROM
        `hrproject`.`b_training_modules`