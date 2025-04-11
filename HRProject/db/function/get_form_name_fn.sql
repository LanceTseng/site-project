CREATE DEFINER=`lance`@`%` FUNCTION `get_form_name_fn`(p_form_id INT) RETURNS varchar(100) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE lv_form_name VARCHAR(100);
    
    SELECT f.form_name 
    INTO lv_form_name
    FROM b_form_design f 
    WHERE f.form_id = p_form_id 
    LIMIT 1;

    RETURN lv_form_name;
END