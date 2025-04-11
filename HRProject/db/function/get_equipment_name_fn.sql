CREATE DEFINER=`lance`@`%` FUNCTION `get_equipment_name_fn`(p_eid INT) RETURNS varchar(45) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE lv_eqpt_name VARCHAR(45);

    -- Fetch equipment name based on equipment ID
    SELECT e.equipment_name 
    INTO lv_eqpt_name 
    FROM b_equipments e 
    WHERE e.equipment_id = p_eid
    LIMIT 1;

    -- Return the equipment name (or empty string if NULL)
    RETURN COALESCE(lv_eqpt_name, '');
END