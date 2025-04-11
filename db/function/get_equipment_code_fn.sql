CREATE DEFINER=`lance`@`%` FUNCTION `get_equipment_code_fn`(p_eqpt_id INT) RETURNS varchar(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE lv_eqpt_code VARCHAR(255);

    SELECT equipment_code 
    INTO lv_eqpt_code 
    FROM b_equipments 
    WHERE equipment_id = p_eqpt_id 
    LIMIT 1;

    RETURN lv_eqpt_code;
END