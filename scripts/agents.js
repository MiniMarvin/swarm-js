class Agent {
    /**
     * state   (dict)              The system state
     * actions (void -> void)      Discrete action availeable to the agent to perform
     * fitness (dict -> double)    The fitness of the system for a specific state
     **/
    constructor(entity, state, actions, fitness) {
        this.entity = entity;
        this.state = state;
        this.actions = actions;
        this.fitness = fitness;
    }
    
    setState(state) {
        this.state = state;
    }
    
    performAction(environment) {
        let map = this.actions.map((action) => {
            // let state = action(this.state);
            let state = action(this.state, environment);
            let fitness = this.fitness(state, environment);
            
            return {fitness: fitness, action: action};
        });
        
        let p = map.reduce((acumulator, pair) => {
            if (acumulator == null) return pair;
            else if (acumulator.fitness < pair.fitness) return pair;
            else return acumulator;
        });
        
        let act = p.action;
        // let state = act(this.state);
        let state = act(this.state, environment);
        // this.state = state;
        this.entity = this.stateToEntity(state, this.entity)
        this.updateState();
        
        return act;
    }
    
    stateToEntity(state, entity) {
        entity.vx = state.vx;
        entity.vy = state.vy;
        // entity.x = state.x;
        // entity.y = state.y;
        return entity;
    }
    
    updateState() {
        this.state.x = this.entity.x;
        this.state.y = this.entity.y;
        this.state.vx = this.entity.vx;
        this.state.vy = this.entity.vy;
    }
}