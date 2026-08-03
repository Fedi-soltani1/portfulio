import type { Snippet } from '@/lib/snippets';

/**
 * Server-rendered C# highlighting.
 *
 * Shiki or Prism would each ship 100kB+ to the browser to colour three
 * static snippets. This tokenises once at build time and emits plain
 * spans — the client downloads nothing but the markup it needs.
 *
 * The tokeniser handles the C# subset these snippets use. It is not a
 * parser, and it is not meant to be: if a future snippet needs something
 * it cannot express, the honest fix is to reach for a real library then.
 */

type Kind = 'comment' | 'string' | 'keyword' | 'type' | 'number' | 'plain';

// C# and TypeScript overlap heavily; one set covers both snippets' needs.
const KEYWORDS = new Set([
  // shared
  'async', 'await', 'return', 'new', 'class', 'interface', 'if', 'else', 'for',
  'while', 'try', 'catch', 'finally', 'throw', 'this', 'null', 'true', 'false',
  'in', 'default', 'is', 'as', 'switch', 'case', 'break', 'continue', 'const',
  'typeof', 'void', 'extends', 'delete',
  // C#
  'public', 'private', 'protected', 'internal', 'sealed', 'static', 'override',
  'virtual', 'abstract', 'struct', 'record', 'var', 'foreach', 'using',
  'namespace', 'base', 'out', 'where', 'dynamic', 'get', 'set', 'init',
  'readonly', 'params', 'ref', 'nameof',
  // TypeScript
  'export', 'import', 'from', 'let', 'function', 'type', 'enum', 'of',
  'implements', 'satisfies', 'undefined',
]);

const TOKEN_RE =
  /(\/\/[^\n]*)|("(?:\\.|[^"\\])*")|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)|([\s\S])/g;

function classify(match: RegExpExecArray): Kind {
  if (match[1] !== undefined) return 'comment';
  if (match[2] !== undefined) return 'string';
  if (match[3] !== undefined) return 'number';
  if (match[4] !== undefined) {
    const word = match[4];
    if (KEYWORDS.has(word)) return 'keyword';
    // Convention over parsing: in C#, PascalCase identifiers are types or
    // members far more often than not, which is enough for reading.
    if (/^[A-Z]/.test(word)) return 'type';
  }
  return 'plain';
}

const COLOUR: Record<Kind, string | undefined> = {
  comment: 'var(--code-comment)',
  string: 'var(--code-string)',
  keyword: 'var(--code-keyword)',
  type: 'var(--code-type)',
  number: 'var(--code-number)',
  plain: undefined,
};

function tokenise(code: string) {
  const out: { text: string; kind: Kind }[] = [];
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(code)) !== null) {
    const kind = classify(match);
    const text = match[0];
    const last = out[out.length - 1];

    // Merge runs of the same kind so the DOM stays small.
    if (last && last.kind === kind) last.text += text;
    else out.push({ text, kind });
  }

  return out;
}

export function CodeBlock({ snippet, label }: { snippet: Snippet; label: string }) {
  const tokens = tokenise(snippet.code);

  return (
    <figure className="code-block" style={{ margin: 0 }}>
      <figcaption
        className="mono"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '0.6rem 1rem',
          borderBottom: '1px solid var(--line)',
          fontSize: '0.6rem',
        }}
      >
        <span>{label}</span>
        <span style={{ color: 'var(--ink-faint)' }}>{snippet.file}</span>
      </figcaption>

      <pre
        style={{
          margin: 0,
          padding: '1.1rem 1rem',
          overflowX: 'auto',
          fontFamily: 'var(--font-mono), ui-monospace, monospace',
          fontSize: '0.78rem',
          lineHeight: 1.65,
          tabSize: 4,
        }}
      >
        <code>
          {tokens.map((token, i) => (
            <span key={i} style={{ color: COLOUR[token.kind] }}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
