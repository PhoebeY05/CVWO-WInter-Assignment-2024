import React from "react";
import { Link } from "react-router-dom";

const Results = () => {
    const results = sessionStorage.getItem("search") ? JSON.parse(sessionStorage.getItem("search")!) : [];
    console.log(results)
    const by_title = results.title ? results.title : []
    const by_content = results.content ? results.content : []
    const by_user = results.user ? results.user : []
    const by_category = results.category ? results.category : []
    const char_limit = 50
    const addHtmlEntities = (str: string) => {
        return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    };
    const content = (array: any, index: number) => {
        const result_content = addHtmlEntities(array[index].content);
        if (result_content.length > char_limit) {
            const shown = result_content.substring(0, char_limit) + "...";
            return (
                <td className="lead">{shown}<Link to={`/posts/${array[index].id}`} className="link-opacity-50-hover">Read more</Link></td>
            )
        } else {
            return (
                <td className="lead">{result_content}</td>
            )
        }
    }
       
    const resultsTable = (results_array: any) => {
        const date_created = (date:string) => date.substring(0, 10);
        return (
            results_array.map((result: any, index: number) => (
                <tr key={index}>
                    <td className="lead"><Link to={`/posts/${result.id}`} className="link-opacity-50-hover">{result.title}</Link></td>
                    <td className="lead text-center">{result.author}</td>
                    <td className="lead text-center">{date_created(result.created_at)}</td>
                    {content(results_array, index)}
                </tr>
                    
            ))
        )
    }

    const sections = (text: string, results_table) => {
        return (
            <div className="py-3 px-4 mb-3 border border-3 border-dark rounded shadow">
                <p className="display-6 my-3">By {text}:</p>
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col" className="h4">Title</th>
                        <th scope="col" className="h4 text-center">Author</th>
                        <th scope="col" className="h4 text-center">Date Created</th>
                        <th scope="col" className="h4">Content</th>
                        <th scope="col" className="h4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {results_table}
                    </tbody>
                </table>
            </div>
        )
    }
    return (
        <div className="container mt-3">
            {by_title.length == 0 && by_content.length == 0 && by_category.length == 0 && by_user.length == 0 ? <h2 className="display-1 position-absolute top-50 start-50 translate-middle">No results found!</h2>: ""}
            {by_title.length > 0 ? sections("Title", resultsTable(by_title)): ""}
            {by_content.length > 0 ? sections("Content", resultsTable(by_content)): ""}
            {by_category.length > 0 ? sections("Category", resultsTable(by_category)): ""}
            {by_user.length > 0 ? sections("User", resultsTable(by_user)): ""}
        </div>
    );
};

export default Results;