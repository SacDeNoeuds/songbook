import { cn } from 'dom-kit'
import type { ComponentProps } from 'dom-kit/jsx/jsx-runtime'
import './table.css'

interface Props extends ComponentProps<'table'> {
  children?: JSX.Children
  /**
   * defines each column's width, can be an rem/px value, "min" or "flex"
   * @example
   * ```tsx
   * <Table columns={['15px', 'flex', 'flex', 'min']} … />
   * ```
   */
  columns?: Array<'flex' | 'min' | `${number}rem` | `${number}px`>
  variant?: 'striped'
}

/**
 * @example
 * ```tsx
 * <Table
 *  variant="striped"
 *  columns={['15px', 'flex', 'flex', 'min']}
 * >
 * <thead>
 *  <tr>
 *    <th>#</th>
 *    <th>Cell 1</th>
 *    <th>Cell 2</th>
 *    <th>Cell 3</th>
 *  </tr>
 * </thead>
 * <tbody>
 *  <tr>
 *    <td>1</td>
 *    <td>Cell 1</td>
 *    <td>Cell 2</td>
 *    <td>Cell 3</td>
 *  </tr>
 * </Table>
 * ```
 */
export const Table = ({ variant, ...props }: Props) => {
  const mount = (table: HTMLTableElement) => {
    props.ref?.(table)
    const columnCount = getColumnCount(table)
    if (props.columns) {
      assertColumnCount(props.columns, columnCount)
      return table.style.setProperty(
        '--columns',
        props.columns
          .join(' ')
          .replaceAll('min', 'min-content')
          .replaceAll('flex', 'minmax(min-content, 1fr)'),
      )
    } else {
      table.style.setProperty('--column-count', String(columnCount))
      table.style.removeProperty('--columns')
    }
  }
  return (
    <table
      {...props}
      class={cn('grid-table', props.class, variant)}
      ref={mount}
    >
      {props.children}
    </table>
  )
}

const assertColumnCount = (columns: unknown[], columnCountInDOM: number) => {
  if (columns.length === columnCountInDOM) return
  throw new Error(
    `received a template for ${columns.length} columns but got ${columnCountInDOM}`,
  )
}

const getColumnCount = (table: HTMLTableElement) => {
  const cells =
    table.querySelectorAll('thead > tr > *') ||
    table.querySelectorAll('tbody > tr:first-child > *')

  return Array.from(cells).reduce((acc, element) => {
    const span =
      (element instanceof HTMLTableCellElement && element.colSpan) ||
      Number(element.ariaColSpan) ||
      1
    return acc + span
  }, 0)
}
