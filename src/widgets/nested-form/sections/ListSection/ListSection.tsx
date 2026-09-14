import './ListSection.scss';
import { useEffect, useRef, useState } from 'react';
import { Avatar, Icon, useColumnMeta, useGrist, useNavigation } from '@lib';
import type { ListConfig } from '@lib';

interface ListItem {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  mail: string;
  url: string;
}

interface ListProps {
  config: ListConfig;
  filterId: number;
}

const asText = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

const asHref = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

export function ListSection({ config, filterId }: ListProps) {
  const { fetchTable } = useGrist();
  const { push, stack } = useNavigation();
  const columnMeta = useColumnMeta(config.table);
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  // Reload when a sub-form pops: the item may have been edited or created there.
  const prevStackLen = useRef(stack.length);
  useEffect(() => {
    if (stack.length < prevStackLen.current) setReloadKey((k) => k + 1);
    prevStackLen.current = stack.length;
  }, [stack.length]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const table = await fetchTable(config.table);
        const ids = table.id;
        const filterVals = table[config.filterCol];

        if (!filterVals) {
          console.warn(
            `[List] Column "${config.filterCol}" not found in table "${config.table}".`,
            'Available columns:', Object.keys(table).join(', '),
          );
          if (!cancelled) setItems([]);
          return;
        }

        const column = (colId?: string) => (colId ? table[colId] : undefined);
        const titles = column(config.titleCol);
        const subtitles = column(config.subtitleCol);
        const badges = column(config.badgeCol);
        const mails = column(config.mailCol);
        const urls = column(config.urlCol);

        const matched: ListItem[] = [];
        for (let i = 0; i < ids.length; i++) {
          const ref = filterVals[i];
          const matches = config.refType === 'RefList'
            ? Array.isArray(ref) && ref[0] === 'L' && ref.includes(filterId)
            : ref === filterId;
          if (!matches) continue;

          matched.push({
            id: ids[i],
            title: asText(titles?.[i]),
            subtitle: asText(subtitles?.[i]),
            badge: asText(badges?.[i]),
            mail: asText(mails?.[i]),
            url: asText(urls?.[i]),
          });
        }

        matched.sort((a, b) => a.title.localeCompare(b.title, 'fr'));

        if (!cancelled) setItems(matched);
      } catch (err) {
        console.warn(`[List] Failed to fetch ${config.table}:`, err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [filterId, fetchTable, reloadKey, config]);

  const handleAdd = () => {
    if (!config.addScreen) return;
    push(config.addScreen, {
      initialFields: { [config.filterCol]: config.refType === 'RefList' ? ['L', filterId] : filterId },
    });
  };

  const handleEdit = (item: ListItem) => {
    push(config.editScreen, { editId: String(item.id), editLabel: item.title });
  };

  const badgeOptions = config.badgeCol ? columnMeta[config.badgeCol]?.widgetOptions?.choiceOptions : undefined;

  return (
    <div className="list-section">
      <hr className="section-divider" />
      <div className="section-title">
        <Icon name={config.icon} />
        {config.title}
        {!loading && items.length > 0 && <span className="list-section__count">{items.length}</span>}
        {config.addScreen && (
          <button type="button" className="section-title__add" onClick={handleAdd} aria-label="Ajouter">
            <Icon name="add" />
          </button>
        )}
      </div>
      {!loading && items.length === 0 && (
        <div className="list-empty">{config.emptyMessage ?? 'Aucun élément'}</div>
      )}
      {!loading && items.length > 0 && (
        <div className="list-section__items">
          {items.map((item) => {
            const colors = badgeOptions?.[item.badge];
            return (
              <div key={item.id} className="list-item" onClick={() => handleEdit(item)}>
                <Avatar fullName={item.title || '?'} size="small" />
                <div className="list-item__text">
                  <span className="list-item__title">{item.title || 'Sans nom'}</span>
                  {item.subtitle && <span className="list-item__subtitle">{item.subtitle}</span>}
                </div>
                {item.badge && (
                  <span
                    className="list-item__badge"
                    style={colors?.fillColor ? { backgroundColor: colors.fillColor, color: colors.textColor } : undefined}
                  >
                    {item.badge}
                  </span>
                )}
                {item.mail && (
                  <a
                    href={`mailto:${item.mail}`}
                    className="list-item__action"
                    title={item.mail}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon name="mail" />
                  </a>
                )}
                {item.url && (
                  <a
                    href={asHref(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="list-item__action"
                    title={item.url}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon name="link" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
