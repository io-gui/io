/** Sets the name of one document object (by uuid). Keeping the name cancels the run, so nothing is recorded. */
class RenameOperator {
    props;
    constructor(props) {
        this.props = props;
    }
    poll(ctx) {
        return !!ctx.document.getObject(this.props.id);
    }
    exec(ctx) {
        if (ctx.document.getObject(this.props.id).name === this.props.name)
            return 'cancelled';
        ctx.transaction.set(this.props.id, 'name', this.props.name);
        return 'finished';
    }
}
export const renameOperatorType = {
    id: 'object.rename',
    label: 'Rename',
    create: props => new RenameOperator(props),
};
