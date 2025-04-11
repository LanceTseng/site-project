CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_form_design` AS
    SELECT 
        `hrproject`.`b_form_design`.`form_id` AS `form_id`,
        `hrproject`.`b_form_design`.`form_name` AS `form_name`,
        `hrproject`.`b_form_design`.`form_type_id` AS `form_type_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('form_type',
                `hrproject`.`b_form_design`.`form_type_id`) AS `form_type_name`,
        `hrproject`.`b_form_design`.`form_question_type_id` AS `form_question_type_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('form_ques_type',
                `hrproject`.`b_form_design`.`form_question_type_id`) AS `form_question_type_name`,
        `hrproject`.`b_form_design`.`form_question_id` AS `form_question_id`,
        `hrproject`.`b_form_design`.`form_question_display` AS `form_question_display`
    FROM
        `hrproject`.`b_form_design`