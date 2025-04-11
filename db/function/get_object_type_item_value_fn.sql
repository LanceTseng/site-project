CREATE DEFINER=`lance`@`%` FUNCTION `get_object_type_item_value_fn`(
    p_object_type_name VARCHAR(255),
    p_object_type_item_key INT
) RETURNS varchar(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE result_value VARCHAR(255);

    SELECT object_type_item_value 
    INTO result_value 
    FROM b_object_type 
    WHERE object_type_name = p_object_type_name 
      AND object_type_item_key = p_object_type_item_key
    LIMIT 1;  -- Ensure only one result is returned

    RETURN result_value;
END