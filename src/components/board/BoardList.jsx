import { Link } from "react-router-dom";
import { ClockIcon } from "../icons/Icons";

const BoardList = ({ boards }) => {
  return (
    <>
      {boards.map((board) => (
        <Link to={`/board/${board.id}`} key={board.id} className="block group">
          <div className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className={`${board.color} text-white p-4`}>
              <h3 className="text-lg font-semibold">{board.title}</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-300">
                {board.description}
              </p>
            </div>
            <div className="p-4 pt-0 text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>Updated {board.updatedAt}</span>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default BoardList;
