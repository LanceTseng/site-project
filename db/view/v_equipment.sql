CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_equipment` AS
    SELECT 
        `hrproject`.`b_equipments`.`equipment_id` AS `equipment_id`,
        `hrproject`.`b_equipments`.`equipment_name` AS `equipment_name`,
        `hrproject`.`b_equipments`.`equipment_type_id` AS `equipment_type_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('equipment_type',
                `hrproject`.`b_equipments`.`equipment_type_id`) AS `equipment_type`,
        `hrproject`.`b_equipments`.`equipment_code` AS `equipment_code`,
        GET_LATEST_OCCUPIED_BY_FN(`hrproject`.`b_equipments`.`equipment_id`) AS `occupied_by`,
        GET_USER_NAME_FN(GET_LATEST_OCCUPIED_BY_FN(`hrproject`.`b_equipments`.`equipment_id`)) AS `occupied_by_name`,
        `hrproject`.`b_equipments`.`occupied` AS `occupied`,
        (SELECT 
                COALESCE(`h`.`released_date`, `h`.`occupied_date`)
            FROM
                `hrproject`.`b_eqpt_occupied_his` `h`
            WHERE
                (`h`.`equipment_id` = `hrproject`.`b_equipments`.`equipment_id`)
            ORDER BY (CASE
                WHEN (`h`.`released_date` IS NULL) THEN 1
                ELSE 0
            END) , `h`.`released_date` DESC , `h`.`occupied_date` DESC
            LIMIT 1) AS `last_update_date`
    FROM
        `hrproject`.`b_equipments`