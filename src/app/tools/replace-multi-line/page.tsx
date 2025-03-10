"use client"

import { useState } from "react";

export default function ReplaceMultiLine() {
    const presetTemplates: Record<string, string> = {
        "域名解析": "{1}|@|A|{2}|600",
        "百度PC收录": "https://www.baidu.com/s?wd=site:{1}"
    };

    const [dataText, setDataText] = useState("Alice\nBob\nCharlie");
    const [outputText, setOutputText] = useState("");
    const [isRandom, setIsRandom] = useState(false); // 是否使用随机替换
    const [selectedTemplate, setSelectedTemplate] = useState("域名解析");
    const [templateText, setTemplateText] = useState(presetTemplates[selectedTemplate]);

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTemplate = e.target.value;
        setSelectedTemplate(newTemplate);
        setTemplateText(presetTemplates[newTemplate]);
    };
    // 生成结果
    const generateText = () => {
        const templates = templateText.split("\n").filter(line => line.trim() !== "");
        const dataList = dataText.split("\n").filter(line => line.trim() !== "");

        let output = dataList.map((data, index) => {
            const dataList = data.split("\t")

            let randomTemplate = isRandom ? templates[Math.floor(Math.random() * templates.length)] : (templates[index] ?? templates[0]);
            for (let i = 1; i < 10; i++) {
                if (!dataList[i - 1]) dataList[i - 1] = dataList[0]
                randomTemplate = randomTemplate.replaceAll(`{${i}}`, dataList[i - 1]);
            }
            return randomTemplate
        }).join("\n");

        setOutputText(output);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-4">批量替换工具</h1>
                <label className="block font-semibold mb-2">选择模板</label>
                <select
                    className="w-full p-2 border rounded mb-4"
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                >
                    {Object.keys(presetTemplates).map((key) => (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    ))}
                </select>
                {/* 模板输入框 */}
                <label className="block font-semibold mb-2">模板（包含 1-10 占位符）</label>
                <textarea
                    className="w-full h-24 border p-2 rounded mb-4"
                    value={templateText}
                    onChange={(e) => setTemplateText(e.target.value)}
                />

                {/* 数据输入框 */}
                <label className="block font-semibold mb-2">数据（每行一个）</label>
                <textarea
                    className="w-full h-24 border p-2 rounded mb-4"
                    value={dataText}
                    onChange={(e) => setDataText(e.target.value)}
                />
                <div className="flex items-center mb-4">
                    <span className="mr-2 font-semibold">替换模式：</span>
                    <button
                        className={`ml-2 px-4 py-2 rounded ${!isRandom ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                        onClick={() => setIsRandom(false)}
                    >
                        顺序替换
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${isRandom ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                        onClick={() => setIsRandom(true)}
                    >
                        随机替换
                    </button>

                </div>
                {/* 生成按钮 */}
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={generateText}
                >
                    生成
                </button>

                {/* 结果框 */}
                <label className="block font-semibold mt-4">生成结果</label>
                <textarea
                    className="w-full h-24 border p-2 rounded bg-gray-200"
                    value={outputText}
                    readOnly
                />
            </div>
        </div>
    );
}
