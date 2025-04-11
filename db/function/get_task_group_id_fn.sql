CREATE DEFINER=`lance`@`%` FUNCTION `get_task_group_id_fn`(p_task_id INT) RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE p_group_id INT DEFAULT -1;

    SELECT IFNULL(task_group_id, -1)
    INTO p_group_id
    FROM b_parent_tasks 
    WHERE task_id = p_task_id
    LIMIT 1;

    RETURN p_group_id;
END