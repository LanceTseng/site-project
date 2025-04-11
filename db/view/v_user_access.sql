CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_user_access` AS
    SELECT 
        `ua`.`user_id` AS `user_id`,
        GET_USER_NAME_FN(`ua`.`user_id`) AS `user_name`,
        `ua`.`access_id` AS `access_id`,
        `a`.`access_name` AS `access_name`,
        `a`.`access_type_id` AS `access_type_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('access_type', `a`.`access_type_id`) AS `access_type_name`,
        `ua`.`enabled` AS `enabled`
    FROM
        (`hrproject`.`rel_user_access` `ua`
        LEFT JOIN `hrproject`.`b_access_provisioning` `a` ON ((`a`.`access_id` = `ua`.`access_id`)))