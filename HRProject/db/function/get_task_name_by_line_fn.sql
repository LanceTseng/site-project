CREATE DEFINER=`lance`@`%` FUNCTION `get_task_name_by_line_fn`(p_line_id INT) RETURNS varchar(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE lv_task_name VARCHAR(255);

    -- Fetch the task name based on line_id
    SELECT v.ct_name 
    INTO lv_task_name 
    FROM v_user_task v 
    WHERE v.line_id = p_line_id
    ORDER BY v.ct_name DESC 
    LIMIT 1;

    -- Return the task name (or empty string if NULL)
    RETURN COALESCE(lv_task_name, '');
END