// import isObjEmpty from "@/utilis/isObjEmpty";
// import Checkbox from "@mui/material/Checkbox";
// import FormControl from "@mui/material/FormControl";
// import FormHelperText from "@mui/material/FormHelperText";
// import InputLabel from "@mui/material/InputLabel";
// import ListItemText from "@mui/material/ListItemText";
// import MenuItem from "@mui/material/MenuItem";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import Select from "@mui/material/Select";
// import { useState } from "react";
// import { Control, Controller, FieldValues, Path } from "react-hook-form";

// interface DropDownMultipleProps<T extends FieldValues> {
//   name: Path<T>;
//   control?: Control<T>;
//   rules?: any;
//   label: string;
//   fullWidth?: boolean;
//   options: {
//     id: number | string;
//     name: string;
//   }[]; // ✅ widened
//   disabled?: boolean;
//   error?: boolean;
//   helperText?: string;
//   onOpen?: () => void;
// }

// export default function DropDownMultiple<T extends FieldValues>({
//   name,
//   control,
//   rules,
//   label,
//   fullWidth = false,
//   options,
//   disabled = false,
//   error,
//   helperText,
//   onOpen,
// }: DropDownMultipleProps<T>) {
//   const [selected, setSelected] = useState<(string | number)[]>([]); // ✅ widened

//   if (!control || isObjEmpty(control)) {
//     return (
//       <FormControl
//         className="w-full"
//         error={error}
//         sx={{
//           "& .MuiInputLabel-root": { mt: "-7px" },
//           "& .MuiInputLabel-shrink": { mt: "0px" },
//           display: "flex",
//           minWidth: "7rem",
//         }}
//       >
//         <InputLabel>{label}</InputLabel>
//         <Select
//           variant="outlined"
//           size="small"
//           multiple
//           value={selected}
//           onOpen={onOpen}
//           onChange={(e) => {
//             const val = e.target.value;
//             setSelected(
//               typeof val === "string" ? [val] : (val as (string | number)[]), // ✅
//             );
//           }}
//           renderValue={(selectedOptions) =>
//             options
//               .filter(
//                 (op) =>
//                   (selectedOptions as (string | number)[]).includes(op.id), // ✅
//               )
//               .map((op) => op.name)
//               .join("; ")
//           }
//           input={<OutlinedInput label={label} />}
//           fullWidth={fullWidth}
//           disabled={disabled}
//         >
//           {options.map((op) => (
//             <MenuItem key={op.id} value={op.id as any}>
//               <Checkbox checked={selected.indexOf(op.id as never) > -1} />
//               <ListItemText primary={op.name} />
//             </MenuItem>
//           ))}
//         </Select>
//         <FormHelperText>{helperText}</FormHelperText>
//       </FormControl>
//     );
//   }

//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={rules}
//       render={({ field, fieldState }) => {
//         const { value, ...restFieldOpts } = field;
//         const currentValue: (string | number)[] = Array.isArray(value)
//           ? value
//           : []; // ✅

//         return (
//           <FormControl
//             className="w-full"
//             error={!!fieldState.error}
//             sx={{
//               "& .MuiInputLabel-root": { mt: "-7px" },
//               "& .MuiInputLabel-shrink": { mt: "0px" },
//               display: "flex",
//             }}
//           >
//             <InputLabel>{label}</InputLabel>
//             <Select
//               variant="outlined"
//               size="small"
//               multiple
//               onOpen={onOpen}
//               renderValue={(selectedOptions) =>
//                 options
//                   .filter(
//                     (op) =>
//                       (selectedOptions as (string | number)[]).includes(op.id), // ✅
//                   )
//                   .map((op) => op.name)
//                   .join("; ")
//               }
//               input={<OutlinedInput label={label} />}
//               fullWidth={fullWidth}
//               value={currentValue}
//               {...restFieldOpts}
//               disabled={disabled}
//             >
//               {options.map((op) => (
//                 <MenuItem key={op.id} value={op.id as any}>
//                   <Checkbox
//                     checked={currentValue.indexOf(op.id as never) > -1}
//                   />
//                   <ListItemText primary={op.name} />
//                 </MenuItem>
//               ))}
//             </Select>
//             <FormHelperText>{fieldState.error?.message}</FormHelperText>
//           </FormControl>
//         );
//       }}
//     />
//   );
// }
import isObjEmpty from "@/utilis/isObjEmpty";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { useEffect, useRef, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface DropDownMultipleProps<T extends FieldValues> {
  name: Path<T>;
  control?: Control<T>;
  rules?: any;
  label: string;
  fullWidth?: boolean;
  options: { id: number | string; name: string }[];
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  onOpen?: () => void;
  placeholder?: string; // shown when nothing is selected
  showSelectAll?: boolean; // adds "All" row at top with indeterminate checkbox
  defaultSelectAll?: boolean; // auto-selects all options on first load
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared helper: builds the display string for the input field.
//
//  • Nothing selected  →  placeholder / label in muted italic
//  • Some selected     →  "Branch A; Branch B"
//  • All selected      →  "All; Branch A; Branch B; ..."   ← new behaviour
//
// The component always stores only IDs in form state; names are looked up here
// purely for display.
// ─────────────────────────────────────────────────────────────────────────────
function buildDisplayValue(
  selected: unknown,
  options: { id: number | string; name: string }[],
  allIds: (number | string)[],
  showSelectAll: boolean,
  placeholder: string | undefined,
  label: string,
): React.ReactNode {
  const ids = Array.isArray(selected) ? (selected as (string | number)[]) : [];

  if (ids.length === 0) {
    return (
      <em style={{ color: "rgba(0,0,0,0.38)", fontStyle: "normal" }}>
        {placeholder ?? label}
      </em>
    );
  }

  const selectedNames = options
    .filter((o) => ids.includes(o.id))
    .map((o) => o.name);

  // All branches selected → prefix with "All"
  if (showSelectAll && allIds.length > 0 && ids.length === allIds.length) {
    return ["All", ...selectedNames].join("; ");
  }

  return selectedNames.join("; ");
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner controlled component (lives inside <Controller>)
// ─────────────────────────────────────────────────────────────────────────────
interface InnerProps {
  field: {
    value: any;
    onChange: (val: any) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
  fieldState: { error?: { message?: string } };
  options: { id: number | string; name: string }[];
  label: string;
  fullWidth: boolean;
  disabled: boolean;
  onOpen?: () => void;
  placeholder?: string;
  showSelectAll: boolean;
  defaultSelectAll: boolean;
}

function ControlledInner({
  field,
  fieldState,
  options,
  label,
  fullWidth,
  disabled,
  onOpen,
  placeholder,
  showSelectAll,
  defaultSelectAll,
}: InnerProps) {
  const { value, onChange, ...restField } = field;

  // Always store an array of IDs in form state
  const currentValue: (string | number)[] = Array.isArray(value) ? value : [];

  const allIds = options.map((o) => o.id);
  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => currentValue.includes(id));
  const isIndeterminate = !isAllSelected && currentValue.length > 0;

  // ── Auto-select all once options load ──────────────────────────────────────
  const defaultSetRef = useRef(false);
  useEffect(() => {
    if (!defaultSelectAll || defaultSetRef.current || allIds.length === 0)
      return;
    defaultSetRef.current = true;
    // 🔑 Store the full ID array so payload always has correct IDs
    onChange(allIds);
  }, [allIds.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toggle "Select All" ────────────────────────────────────────────────────
  const handleSelectAllClick = (e: React.MouseEvent) => {
    e.preventDefault(); // keep Select from treating it as a normal value
    // 🔑 Toggle between [] and full ID array
    onChange(isAllSelected ? [] : allIds);
  };

  // ── Handle individual option change ───────────────────────────────────────
  // MUI passes the full new selection array through e.target.value already,
  // so we just relay it — IDs only, no extra work needed.
  const handleChange = (e: { target: { value: unknown } }) => {
    const val = e.target.value;
    onChange(typeof val === "string" ? val.split(",") : val);
  };

  return (
    <FormControl
      className="w-full"
      error={!!fieldState.error}
      sx={{
        "& .MuiInputLabel-root": { mt: "-7px" },
        "& .MuiInputLabel-shrink": { mt: "0px" },
        display: "flex",
      }}
    >
      <InputLabel shrink={currentValue.length > 0 || undefined}>
        {label}
      </InputLabel>

      <Select
        variant="outlined"
        size="small"
        multiple
        displayEmpty
        onOpen={onOpen}
        value={currentValue} // ← always an array of IDs
        onChange={handleChange} // ← always stores IDs back to form state
        renderValue={(selected) =>
          buildDisplayValue(
            selected,
            options,
            allIds,
            showSelectAll,
            placeholder,
            label,
          )
        }
        input={<OutlinedInput label={label} />}
        fullWidth={fullWidth}
        disabled={disabled}
        {...restField}
      >
        {/* ── Select All row ──────────────────────────────────────────────── */}
        {showSelectAll && (
          <MenuItem dense onMouseDown={handleSelectAllClick}>
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              size="small"
            />
            <ListItemText primary="All" />
          </MenuItem>
        )}

        {/* ── Individual options ──────────────────────────────────────────── */}
        {options.map((op) => (
          <MenuItem key={op.id} value={op.id as any} dense>
            <Checkbox checked={currentValue.includes(op.id)} size="small" />
            <ListItemText primary={op.name} />
          </MenuItem>
        ))}
      </Select>

      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — reusable, works with or without react-hook-form <Controller>
// ─────────────────────────────────────────────────────────────────────────────
export default function DropDownMultiple<T extends FieldValues>({
  name,
  control,
  rules,
  label,
  fullWidth = false,
  options,
  disabled = false,
  error,
  helperText,
  onOpen,
  placeholder,
  showSelectAll = false,
  defaultSelectAll = false,
}: DropDownMultipleProps<T>) {
  // ── Uncontrolled fallback (no control passed) ──────────────────────────────
  const [selected, setSelected] = useState<(string | number)[]>([]);

  if (!control || isObjEmpty(control)) {
    const allIds = options.map((o) => o.id);
    const isAllSelected =
      allIds.length > 0 && allIds.every((id) => selected.includes(id));
    const isIndeterminate = !isAllSelected && selected.length > 0;

    const handleSelectAllClick = (e: React.MouseEvent) => {
      e.preventDefault();
      // 🔑 Toggle between [] and full ID array
      setSelected(isAllSelected ? [] : allIds);
    };

    const handleChange = (e: { target: { value: unknown } }) => {
      const val = e.target.value;
      // 🔑 Always store IDs as an array
      setSelected(
        typeof val === "string" ? val.split(",") : (val as (string | number)[]),
      );
    };

    return (
      <FormControl
        className="w-full"
        error={error}
        sx={{
          "& .MuiInputLabel-root": { mt: "-7px" },
          "& .MuiInputLabel-shrink": { mt: "0px" },
          display: "flex",
          minWidth: "7rem",
        }}
      >
        <InputLabel>{label}</InputLabel>

        <Select
          variant="outlined"
          size="small"
          multiple
          displayEmpty
          value={selected} // ← array of IDs
          onOpen={onOpen}
          onChange={handleChange} // ← stores IDs back to local state
          renderValue={(sel) =>
            buildDisplayValue(
              sel,
              options,
              allIds,
              showSelectAll,
              placeholder,
              label,
            )
          }
          input={<OutlinedInput label={label} />}
          fullWidth={fullWidth}
          disabled={disabled}
        >
          {showSelectAll && (
            <MenuItem dense onMouseDown={handleSelectAllClick}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                size="small"
              />
              <ListItemText primary="All" />
            </MenuItem>
          )}

          {options.map((op) => (
            <MenuItem key={op.id} value={op.id as any} dense>
              <Checkbox checked={selected.includes(op.id)} size="small" />
              <ListItemText primary={op.name} />
            </MenuItem>
          ))}
        </Select>

        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  }

  // ── Controlled path (react-hook-form) ──────────────────────────────────────
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <ControlledInner
          field={field}
          fieldState={fieldState}
          options={options}
          label={label}
          fullWidth={fullWidth}
          disabled={disabled}
          onOpen={onOpen}
          placeholder={placeholder}
          showSelectAll={showSelectAll}
          defaultSelectAll={defaultSelectAll}
        />
      )}
    />
  );
}
