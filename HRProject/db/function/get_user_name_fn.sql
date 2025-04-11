CREATE DEFINER=`lance`@`%` FUNCTION `get_user_name_fn`(p_user_id INT) RETURNS varchar(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE lv_user_name VARCHAR(255);

    SELECT username INTO lv_user_name 
    FROM b_users 
    WHERE user_id = p_user_id;

    RETURN lv_user_name;
END