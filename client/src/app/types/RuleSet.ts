export interface RuleSet {
    _id: string,
    label: string,
    admins: [{
        _id: string,
        userId: string,
        role: string
    }],
}