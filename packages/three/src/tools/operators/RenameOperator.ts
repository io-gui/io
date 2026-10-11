import type { Operator, OperatorContext, OperatorPollContext, OperatorType } from '../Operator.js'

export type RenameProps = {id: string; name: string}

/** Sets the name of one document object (by uuid). Keeping the name cancels the run, so nothing is recorded. */
class RenameOperator implements Operator {
  constructor(private readonly props: RenameProps) {}

  poll(ctx: OperatorPollContext) {
    return !!ctx.document.getObject(this.props.id)
  }

  exec(ctx: OperatorContext) {
    if (ctx.document.getObject(this.props.id)!.name === this.props.name) return 'cancelled' as const
    ctx.transaction.set(this.props.id, 'name', this.props.name)
    return 'finished' as const
  }
}

export const renameOperatorType: OperatorType = {
  id: 'object.rename',
  label: 'Rename',
  create: props => new RenameOperator(props as RenameProps),
}
