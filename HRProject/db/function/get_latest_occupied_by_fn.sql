CREATE DEFINER=`lance`@`%` FUNCTION `get_latest_occupied_by_fn`(p_eqpt_id INT) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE ln_occupied_by INT;
SELECT 
    COALESCE(CAST(h.occupied_by AS CHAR), '')
INTO ln_occupied_by FROM
    b_eqpt_occupied_his h
WHERE
    h.equipment_id = p_eqpt_id
        AND h.released_date IS NULL
ORDER BY h.occupied_date DESC
LIMIT 1;
    RETURN ln_occupied_by;
END