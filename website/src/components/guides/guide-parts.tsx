import Link from "next/link";
import { Fragment } from "react";

import { guidePageLabels } from "@/content/de/guides/hub";
import {
  splitSourceMarkers,
  stripSourceMarkers,
} from "@/content/guides/registry";
import type { GuideTable as GuideTableContent } from "@/content/guides/types";

import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from "../ui";

export function getSourceAnchorId(sourceId: number): string {
  return `quelle-${sourceId}`;
}

type CitedTextProps = Readonly<{ text: string }>;

/** Renders text with every `[n]` marker as a superscript link to its source. */
export function CitedText({ text }: CitedTextProps) {
  const parts = splitSourceMarkers(text);

  return (
    <>
      {parts.map((part, index) =>
        typeof part === "number" ? (
          <sup key={index} className="ml-px leading-none">
            <a
              href={`#${getSourceAnchorId(part)}`}
              className="text-ink rounded-control font-mono text-[0.7em] font-medium underline underline-offset-2 hover:no-underline"
            >
              [{part}]
            </a>
          </sup>
        ) : (
          <Fragment key={index}>
            {/* The superscript sits directly on the preceding word. */}
            {typeof parts[index + 1] === "number" ? part.trimEnd() : part}
          </Fragment>
        ),
      )}
    </>
  );
}

export type BreadcrumbItem = Readonly<{ name: string; href: string }>;

type GuideBreadcrumbProps = Readonly<{ items: readonly BreadcrumbItem[] }>;

/** Visible breadcrumb; the last item is the current page and not a link. */
export function GuideBreadcrumb({ items }: GuideBreadcrumbProps) {
  return (
    <nav aria-label={guidePageLabels.breadcrumbLabel} className="mb-6">
      <ol className="text-muted flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-6">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li
              key={item.href}
              className="flex min-w-0 items-center gap-x-2 [overflow-wrap:anywhere]"
            >
              {index > 0 && <span aria-hidden="true">/</span>}
              {isCurrent ? (
                <span aria-current="page" className="text-ink">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="rounded-control text-ink-soft underline underline-offset-4 hover:text-zinc-950"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type GuideTableProps = Readonly<{ table: GuideTableContent }>;

/** Accessible data table: caption, column headers and row headers. */
export function GuideTable({ table }: GuideTableProps) {
  return (
    <Table
      caption={<CitedText text={table.caption} />}
      scrollLabel={`${guidePageLabels.tableRegionPrefix}: ${stripSourceMarkers(table.caption)}`}
    >
      <TableHead>
        <tr>
          {table.head.map((cell) => (
            <TableHeaderCell key={cell}>{cell}</TableHeaderCell>
          ))}
        </tr>
      </TableHead>
      <TableBody>
        {table.rows.map((row) => (
          <TableRow key={row.join("|")}>
            {row.map((cell, cellIndex) =>
              cellIndex === 0 ? (
                <th
                  key={cellIndex}
                  scope="row"
                  className="text-ink px-5 py-4 align-top text-sm leading-6 font-semibold"
                >
                  <CitedText text={cell} />
                </th>
              ) : (
                <td
                  key={cellIndex}
                  className="text-ink-soft px-5 py-4 align-top text-sm leading-6"
                >
                  <CitedText text={cell} />
                </td>
              ),
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
