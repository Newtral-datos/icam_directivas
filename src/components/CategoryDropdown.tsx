interface Props {
    options: { url: string; texto: string; icon: string }[];
    value: string;
    onChange: (url: string) => void;
  }
  
  export default function CategoryDropdown({ options, value, onChange }: Props) {
    return (
      <div className="category-select">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Filtrar por categoría"
        >
          {options.map(opt => (
            <option key={opt.url} value={opt.url}>
              {opt.texto}
            </option>
          ))}
        </select>
      </div>
    );
  }
  