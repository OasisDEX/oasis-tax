import React from 'react';
import PropTypes from 'prop-types';

const ListItemOption = (props) => {
    return (
        <li className="list-group-item">
            <div className="checkbox">
                <label>
                    <input type="checkbox"
                           onChange={props.inverseOption}
                           defaultChecked={props.option.active}
                    />
                    {props.option.name}
                </label>
            </div>
        </li>
    );

};

ListItemOption.PropTypes = {
    option: PropTypes.object.isRequired,
    inverseOption: PropTypes.func.isRequired
};

export default ListItemOption;

