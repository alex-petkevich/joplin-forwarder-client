export interface IRules {
    id?: number,
    user_id?: number,
    name: string,
    type: number,
    comparison_method?: number,
    active?: Boolean,
    stop_process_rules?: Boolean,
    save_in?: number,
    priority?: number,
    save_in_parent_id?: string,
    final_action?: number,
    processed?: number,
    comparison_text?: string,
    final_action_target?: string
    created_at?: Date,
    last_modified_at?: Date,
    last_processed_at?: Date

}