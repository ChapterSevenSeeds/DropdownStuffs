import styled from '@emotion/styled'
import _ from "lodash";
import { useEffect, useMemo, useRef, useState } from 'react';
import DropdownPopper from './DropdownPopper';

export type SelectOption = {
    value: string;
    label: string;
}
export type SelectProps<T extends SelectOption> = {
    label: string;
    options: T[]
    onChange: (value: string) => void;
}

const Root = styled.div`
cursor: pointer;
width: 300px;
height: 20px;
border: 1px solid darkgray;
border-radius: 4px;
padding: 4px 8px;
display: flex;
justify-content: space-between;
`

export default function DropdownSelect<T extends SelectOption>(props: SelectProps<T>) {
    const [value, setValue] = useState<string | null | undefined>(null);
    const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const selectedLabel = useMemo(() => props.options.find(x => x.value === value)?.label, [value, props.options]);

    useEffect(() => {
        function closeDropdown() {
            setRootElement(null);
        }

        document.addEventListener("click", closeDropdown);

        return () => {
            document.removeEventListener("click", closeDropdown);
        }
    });

    function rootClick(e: React.MouseEvent) {
        setRootElement(rootElement ? null : rootRef.current);
        e.stopPropagation();
    }

    function itemSelected(value: string) {
        setValue(value);
        setRootElement(null);
    }

    return (
        <>
            <Root
                ref={rootRef}
                onClick={rootClick}
            >
                {selectedLabel &&
                    <span>{selectedLabel}</span>
                }
                {!selectedLabel &&
                    <span style={{ color: "gray", userSelect: "none" }}>
                        {props.label}
                    </span>
                }
                <img style={{ userSelect: "none" }} src="expand.svg" alt="expand-icon" />
            </Root>
            <DropdownPopper parent={rootElement} valueChanged={itemSelected} allOptions={props.options} selectedValue={value} />
        </>
    );
}

