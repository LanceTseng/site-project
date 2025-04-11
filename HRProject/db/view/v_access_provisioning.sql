CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_access_provisioning` AS
    SELECT 
        `hrproject`.`b_access_provisioning`.`access_id` AS `access_id`,
        `hrproject`.`b_access_provisioning`.`access_name` AS `access_name`,
        `hrproject`.`b_access_provisioning`.`access_description` AS `access_description`,
        `hrproject`.`b_access_provisioning`.`access_type_id` AS `access_type_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('access_type',
                `hrproject`.`b_access_provisioning`.`access_type_id`) AS `access_type_name`,
        `hrproject`.`b_access_provisioning`.`access_role_id` AS `user_role_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('user_role',
                `hrproject`.`b_access_provisioning`.`access_role_id`) AS `access_role_name`,
        `hrproject`.`b_access_provisioning`.`enabled` AS `enabled`
    FROM
        `hrproject`.`b_access_provisioning`