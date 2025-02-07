import React from "react";
import CrossCloseButton from "./cross-close-button";

type TimeTableItemParamter = {
  id: number;
  day: string;
  hour: string;
  munite: string;
  dayPart: string;
  handleTimeTableItemChangeCallback: Function;
  handleDeleteCallback: Function;
};
export default function TimeTableItem({
  id,
  day,
  hour,
  munite,
  dayPart,
  handleTimeTableItemChangeCallback,
  handleDeleteCallback,
}: TimeTableItemParamter) {
  return (
    <div className="flex gap-4">
      <select
        className="bg-white px-2 rounded-md"
        style={{ border: "solid 1px #27AAE1" }}
        value={day}
        onChange={(e) =>
          handleTimeTableItemChangeCallback(id, "day", e.target.value)
        }
      >
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
        <option>Saturday</option>
        <option>Sunday</option>
      </select>
      <label
        className="bg-white px-2 rounded-md"
        style={{ border: "solid 1px #27AAE1" }}
      >
        <select
          className="bg-white px-2 rounded-md"
          value={hour}
          onChange={(e) =>
            handleTimeTableItemChangeCallback(id, "hour", e.target.value)
          }
        >
          <option>00</option>
          <option>01</option>
          <option>02</option>
          <option>03</option>
          <option>04</option>
          <option>05</option>
          <option>06</option>
          <option>07</option>
          <option>08</option>
          <option>09</option>
          <option>10</option>
          <option>11</option>
        </select>
        :
        <select
          className="bg-white px-2 rounded-md"
          value={munite}
          onChange={(e) =>
            handleTimeTableItemChangeCallback(id, "munite", e.target.value)
          }
        >
          <option>00</option>
          <option>01</option>
          <option>02</option>
          <option>03</option>
          <option>04</option>
          <option>05</option>
          <option>06</option>
          <option>07</option>
          <option>08</option>
          <option>09</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
          <option>14</option>
          <option>15</option>
          <option>16</option>
          <option>17</option>
          <option>18</option>
          <option>19</option>
          <option>20</option>
          <option>21</option>
          <option>21</option>
          <option>22</option>
          <option>23</option>
          <option>24</option>
          <option>25</option>
          <option>26</option>
          <option>27</option>
          <option>28</option>
          <option>29</option>
          <option>30</option>
          <option>31</option>
          <option>32</option>
          <option>33</option>
          <option>34</option>
          <option>35</option>
          <option>36</option>
          <option>37</option>
          <option>38</option>
          <option>39</option>
          <option>40</option>
          <option>41</option>
          <option>42</option>
          <option>43</option>
          <option>44</option>
          <option>45</option>
          <option>46</option>
          <option>47</option>
          <option>48</option>
          <option>49</option>
          <option>50</option>
          <option>51</option>
          <option>52</option>
          <option>53</option>
          <option>54</option>
          <option>55</option>
          <option>56</option>
          <option>57</option>
          <option>58</option>
          <option>59</option>
        </select>
      </label>
      <label>
        <span
          className={`px-2 rounded-l-md cursor-pointer ${
            dayPart === "AM" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""
          }`}
          style={{
            border: "solid 1px #27AAE1",
            paddingTop: "2px",
            paddingBottom: "2px",
          }}
          onClick={(e) =>
            handleTimeTableItemChangeCallback(id, "dayPart", "AM")
          }
        >
          AM
        </span>
        <span
          className={`px-2 rounded-r-md cursor-pointer ${
            dayPart === "PM" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""
          }`}
          style={{
            border: "solid 1px #27AAE1",
            paddingTop: "2px",
            paddingBottom: "2px",
          }}
          onClick={(e) =>
            handleTimeTableItemChangeCallback(id, "dayPart", "PM")
          }
        >
          PM
        </span>
      </label>
      <CrossCloseButton callBack={() => handleDeleteCallback(id)} />
    </div>
  );
}
