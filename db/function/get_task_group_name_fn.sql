CREATE DEFINER=`lance`@`%` FUNCTION `get_task_group_name_fn`(p_task_id INT) RETURNS varchar(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE p_group_name VARCHAR(255);

    SELECT get_object_type_item_value_fn('task_group', task_group_id) 
    INTO p_group_name 
    FROM b_parent_tasks 
    WHERE task_id = p_task_id;

    RETURN p_group_name;
END