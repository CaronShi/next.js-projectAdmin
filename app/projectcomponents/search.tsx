"use client";
import React, { useState } from "react";
import styles from "./styles/index.module.css";
import { ModelsAPI } from "../../pages/api/modelAPI";
import { useRouter } from "next/navigation";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const Search = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const route = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [modelNameToIdMap, setModelNameToIdMap] = useState<{
    [x: string]: any;
  }>({});
  const [modelName, setModelName] = useState<string>("");

  const handleInputChange = async (e: { target: { value: any } }) => {
    const org_id = process.env.NEXT_PUBLIC_ORG_ID;
    const inputValue = e.target.value;
    setQuery(inputValue);

    // Implement your autocomplete logic here
    // For example, you can fetch suggestions from an API based on the inputValue
    // Replace the following with your actual autocomplete logic

    const response = await ModelsAPI.searchModelByName(inputValue, org_id);
    const accessibleModelData = response.accessibleModels || [];
    const inaccessibleModelData = response.inaccessibleModels || [];

    // Merge accessible and inaccessible model data
    const allModelData = [...accessibleModelData, ...inaccessibleModelData];

    const modelData = allModelData.map((model) => model.model_name);

    const updatedModelNameToIdMap = allModelData.reduce((acc, model) => {
      acc[model.model_name] = model.model_id;
      return acc;
    }, {});

    setModelNameToIdMap(updatedModelNameToIdMap);

    setModelName(inputValue); // Store the input value in state

    const filteredSuggestions = modelData.filter((suggestion: string) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filteredSuggestions as never[]);

    // Show/hide suggestions based on input value
    setShowSuggestions(inputValue !== "");
  };

  const handleSuggestionClick = (
    suggestion: React.SetStateAction<string>,
    model_id: string
  ) => {
    // Set the selected suggestion in the input field
    setQuery(suggestion);

    // Hide the suggestions dropdown
    setShowSuggestions(false);

    // Trigger the search with the selected suggestion
    onSearch(suggestion as string);

    route.push(`../projectlist/project/${model_id}`);
  };

  return (
    <div className={styles.searchBox}>
      <Input
        prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
        placeholder="Search Project Name"
        value={query}
        onChange={handleInputChange}
        className={styles.inputField}
      />
      {showSuggestions && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() =>
                handleSuggestionClick(suggestion, modelNameToIdMap[suggestion])
              }
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
