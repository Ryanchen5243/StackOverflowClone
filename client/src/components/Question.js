import TagButton from './TagButton';
import { getDate } from '../utils/utils';
import { useContext } from 'react';
import AppStateContext from '../context/AppStateContext';

export default function Question({ question, tags }) {
    const { updatePage, updateQuestion } = useContext(AppStateContext);
    
    const buttonList = tags.map(tag => <TagButton tag = {tag} key = {tag._id}/>)
    async function handleClickTitle() {
        await updateQuestion(question);
        updatePage("questionView");
    }
    return (
    <>
        <div className="questions">
            <table>
                <tbody>
                <tr>
                    <td className="qleft">
                        <p>&nbsp;{ question.answers.length }&nbsp; answers <br />{ question.num_views }&nbsp;views<br />{ question.num_votes }&nbsp;votes</p>
                    </td>
                    <td className="qmiddle">
                        <button className="titleBtn" type="button" onClick={handleClickTitle} style={{fontWeight: "bold"}}>
                            {question.title}
                        </button>
                        <p>{question.summary}</p>
                    </td>
                    <td className="qright">
                        { question.asked_by.username }&nbsp;asked&nbsp;{ getDate(question.ask_date_time) }
                    </td>
                </tr>
                <tr>
                    <td className="qleft"></td>
                    <td className="qmiddle">
                        { buttonList }
                    </td>
                    <td className="qright"></td>
                </tr>
                </tbody>
            </table>
        </div>
    </>
    );
}