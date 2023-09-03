import styled from '@emotion/styled'
import _ from "lodash";
import { useEffect, useMemo, useRef, useState } from 'react';
import { SelectOption } from './DropdownSelect';

const SEARCH_ROOT_HEIGHT = 23;

const SearchRoot = styled.div`
padding: 4px;
background-color: lightgray;
position: sticky;
height: ${SEARCH_ROOT_HEIGHT}px;
top: 0;
`;

const SearchBox = styled.input`
border-radius: 4px;
width: calc(100% - 8px);
outline: 0;
border: 2px solid #6a95cb;
`

const DropdownRoot = styled.div`
background-color: white;
border: 1px solid darkgray;
border-radius: 4px;
overflow: auto;

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 50px;
  border: 2px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}
`;

const OptionRoot = styled.div<{ selected?: boolean, focused?: boolean }>`
cursor: pointer;
padding: 2px 4px;

${props => !props.selected && !props.focused && `
&:hover {
    background-color: #9fc3f870;
}
`}

${props => !props.selected && props.focused && `
background-color: #9fc3f870;
`}

${props => props.selected && `
background-color: #0d6efd;
color: white;
`}
`;

function isInView(element?: HTMLElement | null) {
    if (!element) return true;

    const container = element.parentElement as HTMLElement;
    const cTop = container.scrollTop;
    const cBottom = cTop + container.clientHeight;
    const eTop = element.offsetTop;
    const eBottom = eTop + element.clientHeight;
    const isTotal = (eTop >= cTop + SEARCH_ROOT_HEIGHT && eBottom <= cBottom);

    return isTotal;
}
export default function DropdownPopper<T extends SelectOption>(props: { parent?: HTMLElement | null, valueChanged: (value: string) => void, allOptions: T[], selectedValue?: string | null }) {
    const [searchValue, setSearchValue] = useState("");
    const [keyboardFocusedValue, setKeyboardFocusedValue] = useState("");
    const initialScrollDone = useRef(false);
    const itemRefsByValue = useRef<Record<string, HTMLDivElement | null>>({});

    const filteredOptions = useMemo<T[]>(() => {
        const searchRegex = new RegExp(_.escapeRegExp(searchValue), "ig");
        return props.allOptions.filter(option => searchRegex.test(option.label));
    }, [props.allOptions, searchValue]);

    useEffect(() => {
        setSearchValue("");
        setKeyboardFocusedValue(props.selectedValue ?? "");
        initialScrollDone.current = false;
    }, [props.parent]);

    function searchBoxClick(e: React.MouseEvent) {
        e.stopPropagation();
    }

    function searchValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(e.target.value);
    }

    function searchBoxKeyDown(e: React.KeyboardEvent) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (filteredOptions.length === 0) return;

            let newIndex: number;
            if (e.key === "ArrowDown") {
                newIndex = Math.min(filteredOptions.length - 1, filteredOptions.findIndex(x => x.value === keyboardFocusedValue) + 1);
            } else {
                newIndex = Math.max(0, filteredOptions.findIndex(x => x.value === keyboardFocusedValue) - 1);
            }

            const newValue = filteredOptions[newIndex].value;
            setKeyboardFocusedValue(newValue);
            if (!isInView(itemRefsByValue.current[newValue])) {
                itemRefsByValue.current[newValue]?.scrollIntoView({
                    block: "center"
                });
            }
        } else if (e.key === "Enter" && keyboardFocusedValue) {
            props.valueChanged(keyboardFocusedValue);
        }
    }

    if (!props.parent) return null;

    return (
        <DropdownRoot
            data-cy="dropdown-root"
            style={{
                position: "fixed",
                left: props.parent.offsetLeft,
                top: `calc(${props.parent.offsetTop}px + ${props.parent.offsetHeight}px + 4px)`,
                width: `calc(${props.parent.offsetWidth}px)`,
                maxHeight: "200px"
            }}
        >
            <SearchRoot onClick={searchBoxClick}>
                <SearchBox data-cy="search-box" autoFocus value={searchValue} onChange={searchValueChange} onKeyDown={searchBoxKeyDown} />
            </SearchRoot>
            {filteredOptions.map(option => {
                const selected = props.selectedValue === option.value;
                const focused = keyboardFocusedValue === option.value;

                return (
                    <OptionRoot
                        id={`option-${option.value}`}
                        focused={focused}
                        key={option.value}
                        onClick={() => props.valueChanged(option.value)}
                        selected={selected}
                        ref={ref => {
                            if (selected && ref && !initialScrollDone.current) {
                                ref.scrollIntoView({
                                    block: "center"
                                });
                                initialScrollDone.current = true;
                            }

                            itemRefsByValue.current[option.value] = ref;
                        }}
                    >
                        {option.label}
                    </OptionRoot>
                );
            })}
        </DropdownRoot>
    );
}