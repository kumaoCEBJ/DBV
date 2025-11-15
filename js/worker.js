let isCancelled = false;

self.onmessage = async function (e) {
    const message = e.data;
    if (!message || typeof message.type === 'undefined') {
        self.postMessage({ type: 'error', payload: 'Received message with unknown format' });
        return;
    }
    switch (message.type) {
        case 'start': 
            const debug = true;
            isCancelled = false;
            const inputData = JSON.parse(message.payload);

            const sim_unit_u = inputData.Sim_Unit_U;
            const sim_unit_c = inputData.Sim_Unit_C;
            const sim_title_u = inputData.Sim_Title_U;
            const sim_title_c_pre = inputData.Sim_Title_C1;
            const sim_title_c_suf = inputData.Sim_Title_C2;
            const sim_equip1 = inputData.Sim_Equip_Type;
            const sim_equip3 = inputData.Sim_Equip3;

            const sim_setting = inputData.Sim_Setting;
            const can_or = inputData.Can_Or;
            const filter_kago = inputData.Filter_Kago;
            const filter_kago_or = inputData.Filter_Kago_Or;
            const filter_slay = inputData.Filter_Slay;
            const filter_slay_or = inputData.Filter_Slay_Or;

            const is_unique = inputData.Is_Sim_Unique;
            const is_common = inputData.Is_Sim_Common;
            const can_torehan = inputData.Can_Torehan;

            const gekiha_setting = inputData.Gekiha_Setting;
            const gurume_setting = inputData.Gurume_Setting;
            const has_gekiha = inputData.Has_Gekiha;
            const has_gurume = inputData.Has_Gurume;

            const list_limit = inputData.List_Limit;

            let counter = 0;
            let count_torehan = 0;
            const result_unit_list = [];

            let skill1pow = 0;
            let skill2pow = 0;
            let skill3pow = 0;
            let skill4pow = 0;
            let skill5pow = 0;
            let skill6pow = 0;
            let skill7pow = 0;
            let skill8pow = 0;
            let skill9pow = 0;

            let skill1 = false;
            let skill2 = false;
            let skill3 = false;
            let skill4 = false;
            let skill5 = false;
            let skill6 = false;
            let skill7 = false;
            let skill8 = false;
            let skill9 = false;

            let filtercount = 0;
            let skill_zero = 0;
            let IsOK = false;
            let IsOK_Or = false;
            let leader_only = false;


            if (is_unique) {
                for (const unit of sim_unit_u) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                    if (!isCancelled) {
                        counter++;
                        self.postMessage({
                            type: 'progress',
                            payload: { currentIndex: counter }
                        });
                    }                    
                    IsOK = true;
                    for (let i = 0; i < 9; i++) {
                        if (sim_setting[i].Name !== "") {
                            if (sim_setting[i].Is_Reject === true) {
                                if (i === 0 && unit.Skill_Count1 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 1 && unit.Skill_Count2 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 2 && unit.Skill_Count3 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 3 && unit.Skill_Count4 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 4 && unit.Skill_Count5 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 5 && unit.Skill_Count6 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 6 && unit.Skill_Count7 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 7 && unit.Skill_Count8 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 8 && unit.Skill_Count9 > 0) {
                                    IsOK = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (IsOK === false) continue;


                    for (const title of sim_title_u) {
                        if (title.NameForTitle === unit.Name || title.Name === "") {
                            for (const equip1 of sim_equip1[unit.CategoryEquip1]) {
                                for (const equip2 of sim_equip1[unit.CategoryEquip2]) {
                                    for (const equip3 of sim_equip3) {                                        
                                        if (can_torehan && equip3.Name != "") {
                                            continue;
                                        }
                                        //#region
                                        IsOK = false;
                                        IsOK_Or = false;
                                        skill1pow = 0;
                                        skill2pow = 0;
                                        skill3pow = 0;
                                        skill4pow = 0;
                                        skill5pow = 0;
                                        skill6pow = 0;
                                        skill7pow = 0;
                                        skill8pow = 0;
                                        skill9pow = 0;

                                        skill1 = false;
                                        skill2 = false;
                                        skill3 = false;
                                        skill4 = false;
                                        skill5 = false;
                                        skill6 = false;
                                        skill7 = false;
                                        skill8 = false;
                                        skill9 = false;

                                        filtercount = 0;
                                        skill_zero = 0;
                                        //#endregion

                                        filtercount = 0;
                                        if (filter_kago.length === 0 || filter_kago.includes("AllOn")) { IsOK = true; }
                                        else {
                                            if (filter_kago_or) {
                                                for (let i = 0; i < filter_kago.length; i++) {
                                                    if (title.TitleKago1 !== "") {
                                                        if (title.TitleKago1 === filter_kago[i]) {
                                                            IsOK = true;
                                                            break;
                                                        }
                                                    }
                                                    else if (unit.Kago1 === filter_kago[i]) {
                                                        IsOK = true;
                                                        break;
                                                    }
                                                    if (unit.Kago2 !== "") {
                                                        if (unit.Kago2 === filter_kago[i]) {
                                                            IsOK = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            else {                                             
                                                if (filter_kago.length > 2) { }
                                                else if (filter_kago.length === 1) {
                                                    if (title.TitleKago1 !== "") {
                                                        if (title.TitleKago1 === filter_kago[0]) {
                                                            filtercount++;
                                                        }
                                                    }
                                                    else if (unit.Kago1 === filter_kago[0]) {
                                                        filtercount++;
                                                    }
                                                    if (unit.Kago2 !== "") {
                                                        if (unit.Kago2 === filter_kago[0]) {
                                                            filtercount++;
                                                        }
                                                    }
                                                    if (filtercount === 2) {
                                                        IsOK = true;
                                                    }
                                                }
                                                else {
                                                    for (let i = 0; i < filter_kago.length; i++) {
                                                        if (title.TitleKago1 !== "") {
                                                            if (title.TitleKago1 === filter_kago[i]) {
                                                                filtercount++;
                                                                continue;
                                                            }
                                                        }
                                                        else if (unit.Kago1 === filter_kago[i]) {
                                                            filtercount++;
                                                            continue;
                                                        }
                                                        if (unit.Kago2 !== "") {
                                                            if (unit.Kago2 === filter_kago[i]) {
                                                                filtercount++;
                                                                continue;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    if (filter_kago.length === filtercount) {
                                                        IsOK = true;
                                                    }
                                                }
                                            }
                                        }
                                        if (IsOK === false) continue;

                                        IsOK = false;
                                        filtercount = 0;
                                        if (filter_slay.length === 0 || filter_slay.includes("AllOn")) { IsOK = true; }
                                        else {
                                            if (filter_slay_or) {
                                                for (let i = 0; i < filter_slay.length; i++) {
                                                    if (filter_slay[i] === "") {
                                                        if (unit.Slay === "" &&
                                                            title.TitleSlay1 === "" && title.TitleSlay2 === "" &&
                                                            equip1.EquipSlay1 === "" && equip1.EquipSlay2 === "" &&
                                                            equip2.EquipSlay1 === "" && equip2.EquipSlay2 === "" &&
                                                            equip3.EquipSlay1 === "") {
                                                            IsOK = true;
                                                            break;
                                                        }
                                                    }
                                                    else if (unit.Slay.includes(filter_slay[i]) ||
                                                        title.TitleSlay1.includes(filter_slay[i]) ||
                                                        title.TitleSlay2.includes(filter_slay[i]) ||
                                                        equip1.EquipSlay1.includes(filter_slay[i]) ||
                                                        equip1.EquipSlay2.includes(filter_slay[i]) ||
                                                        equip2.EquipSlay1.includes(filter_slay[i]) ||
                                                        equip2.EquipSlay2.includes(filter_slay[i]) ||
                                                        equip3.EquipSlay1.includes(filter_slay[i])) {
                                                        IsOK = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            else {
                                                if (filter_slay.length === 1) {
                                                    if (filter_slay[0] === "") {
                                                        if (unit.Slay === "" &&
                                                            title.TitleSlay1 === "" && title.TitleSlay2 === "" &&
                                                            equip1.EquipSlay1 === "" && equip1.EquipSlay2 === "" &&
                                                            equip2.EquipSlay1 === "" && equip2.EquipSlay2 === "" &&
                                                            equip3.EquipSlay1 === "") {
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else {
                                                        if (unit.Slay.includes(filter_slay[0])) { filtercount++; }
                                                        if (title.TitleSlay1.includes(filter_slay[0])) { filtercount++; }
                                                        if (title.TitleSlay2.includes(filter_slay[0])) { filtercount++; }
                                                        if (equip1.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                        if (equip1.EquipSlay2.includes(filter_slay[0])) { filtercount++; }
                                                        if (equip2.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                        if (equip2.EquipSlay2.includes(filter_slay[0])) { filtercount++; }
                                                        if (equip3.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                        if (filtercount >= 2) IsOK = true;
                                                    }
                                                }
                                                else {
                                                    for (let i = 0; i < filter_slay.length; i++) {
                                                        if (unit.Slay.includes(filter_slay[i]) ||
                                                            title.TitleSlay1.includes(filter_slay[i]) ||
                                                            title.TitleSlay2.includes(filter_slay[i]) ||
                                                            equip1.EquipSlay1.includes(filter_slay[i]) ||
                                                            equip1.EquipSlay2.includes(filter_slay[i]) ||
                                                            equip2.EquipSlay1.includes(filter_slay[i]) ||
                                                            equip2.EquipSlay2.includes(filter_slay[i]) ||
                                                            equip3.EquipSlay1.includes(filter_slay[i])) {
                                                            filtercount++;
                                                            continue;
                                                        }
                                                        break;
                                                    }
                                                    if (filter_slay.length === filtercount) {
                                                        IsOK = true;
                                                    }
                                                }
                                            }
                                        }
                                        if (IsOK === false) continue;

                                        if (has_gekiha) {
                                            const all_numbers = [];
                                            if (unit.Gekiha !== null) {
                                                for (const uni of unit.Gekiha) {
                                                    all_numbers.push(uni);
                                                }
                                            }
                                            if (title.Gekiha1 !== 0) { all_numbers.push(title.Gekiha1); }
                                            if (title.Gekiha2 !== 0) { all_numbers.push(title.Gekiha2); }
                                            if (equip1.Gekiha1 !== 0) { all_numbers.push(equip1.Gekiha1); }
                                            if (equip1.Gekiha2 !== 0) { all_numbers.push(equip1.Gekiha2); }
                                            if (equip2.Gekiha1 !== 0) { all_numbers.push(equip2.Gekiha1); }
                                            if (equip2.Gekiha2 !== 0) { all_numbers.push(equip2.Gekiha2); }
                                            if (equip3.Gekiha1 !== 0) { all_numbers.push(equip3.Gekiha1); }
                                            if (all_numbers.length === 0) { continue; }

                                            const check_power = [];
                                            const used_numbers = [];

                                            let check_count = 0;
                                            if (await checkGekihaGurume(0, all_numbers, used_numbers, check_power, gekiha_setting)) {
                                                for (let i = 0; i < 9; i++) {
                                                    if (sim_setting[i].Name === "撃破金運") {
                                                        if (i === 0) {
                                                            skill1pow = check_power[check_count];
                                                            check_count++;
                                                            skill1 = true;
                                                        }
                                                        else if (i === 1) {
                                                            skill2pow = check_power[check_count];
                                                            check_count++;
                                                            skill2 = true;
                                                        }
                                                        else if (i === 2) {
                                                            skill3pow = check_power[check_count];
                                                            check_count++;
                                                            skill3 = true;
                                                        }
                                                        else if (i === 3) {
                                                            skill4pow = check_power[check_count];
                                                            check_count++;
                                                            skill4 = true;
                                                        }
                                                        else if (i === 4) {
                                                            skill5pow = check_power[check_count];
                                                            check_count++;
                                                            skill5 = true;
                                                        }
                                                        else if (i === 5) {
                                                            skill6pow = check_power[check_count];
                                                            check_count++;
                                                            skill6 = true;
                                                        }
                                                        else if (i === 6) {
                                                            skill7pow = check_power[check_count];
                                                            check_count++;
                                                            skill7 = true;
                                                        }
                                                        else if (i === 7) {
                                                            skill8pow = check_power[check_count];
                                                            check_count++;
                                                            skill8 = true;
                                                        }
                                                        else if (i === 8) {
                                                            skill9pow = check_power[check_count];
                                                            check_count++;
                                                            skill9 = true;
                                                        }
                                                    }
                                                }
                                            }
                                            else { continue; }
                                        }
                                        if (has_gurume) {
                                            const all_numbers = [];
                                            if (unit.Gurume !== null) {
                                                for (const uni of unit.Gurume) {
                                                    all_numbers.push(uni);
                                                }
                                            }
                                            if (title.Gurume1 !== 0) { all_numbers.push(title.Gurume1); }
                                            if (title.Gurume2 !== 0) { all_numbers.push(title.Gurume2); }
                                            if (equip1.Gurume1 !== 0) { all_numbers.push(equip1.Gurume1); }
                                            if (equip1.Gurume2 !== 0) { all_numbers.push(equip1.Gurume2); }
                                            if (equip2.Gurume1 !== 0) { all_numbers.push(equip2.Gurume1); }
                                            if (equip2.Gurume2 !== 0) { all_numbers.push(equip2.Gurume2); }
                                            if (equip3.Gurume1 !== 0) { all_numbers.push(equip3.Gurume1); }
                                            if (all_numbers.length === 0) { continue; }

                                            const check_power = [];
                                            const used_numbers = [];

                                            let check_count = 0;
                                            if (await checkGekihaGurume(0, all_numbers, used_numbers, check_power, gurume_setting)) {
                                                for (let i = 0; i < 9; i++) {
                                                    if (sim_setting[i].Name === "グルメ魂") {
                                                        if (i === 0) {
                                                            skill1pow = check_power[check_count];
                                                            check_count++;
                                                            skill1 = true;
                                                        }
                                                        else if (i === 1) {
                                                            skill2pow = check_power[check_count];
                                                            check_count++;
                                                            skill2 = true;
                                                        }
                                                        else if (i === 2) {
                                                            skill3pow = check_power[check_count];
                                                            check_count++;
                                                            skill3 = true;
                                                        }
                                                        else if (i === 3) {
                                                            skill4pow = check_power[check_count];
                                                            check_count++;
                                                            skill4 = true;
                                                        }
                                                        else if (i === 4) {
                                                            skill5pow = check_power[check_count];
                                                            check_count++;
                                                            skill5 = true;
                                                        }
                                                        else if (i === 5) {
                                                            skill6pow = check_power[check_count];
                                                            check_count++;
                                                            skill6 = true;
                                                        }
                                                        else if (i === 6) {
                                                            skill7pow = check_power[check_count];
                                                            check_count++;
                                                            skill7 = true;
                                                        }
                                                        else if (i === 7) {
                                                            skill8pow = check_power[check_count];
                                                            check_count++;
                                                            skill8 = true;
                                                        }
                                                        else if (i === 8) {
                                                            skill9pow = check_power[check_count];
                                                            check_count++;
                                                            skill9 = true;
                                                        }
                                                    }
                                                }
                                            }
                                            else { continue; }

                                        }
                                        for (let i = 0; i < 9; i++) {
                                            if (sim_setting[i].Name !== "") {
                                                if (sim_setting[i].Can_Or === true || sim_setting[i].Is_Reject === true) continue;
                                                skill_zero = 0;
                                                IsOK = false;
                                                if (sim_setting[i].Name === "撃破金運" || sim_setting[i].Name === "グルメ魂") {
                                                    IsOK = true;
                                                }
                                                else {
                                                    if (i === 0) {
                                                        skill1pow = unit.Skill_Pow1 + title.Skill_Pow1 + equip1.Skill_Pow1 + equip2.Skill_Pow1 + equip3.Skill_Pow1;
                                                        skill_zero = unit.Skill_Count1 + title.Skill_Count1 + equip1.Skill_Count1 + equip2.Skill_Count1 + equip3.Skill_Count1;
                                                        if (skill_zero === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill1pow === 0 && skill_zero > 0) {
                                                                if (unit.Skill_Count1 + equip3.Skill_Count1 > 1) {
                                                                    IsOK = false;
                                                                    break;
                                                                }
                                                            }
                                                            else {
                                                                if (skill1pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill1pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            skill1 = true;
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 1) {
                                                        skill2pow = unit.Skill_Pow2 + title.Skill_Pow2 + equip1.Skill_Pow2 + equip2.Skill_Pow2 + equip3.Skill_Pow2;
                                                        skill_zero = unit.Skill_Count2 + title.Skill_Count2 + equip1.Skill_Count2 + equip2.Skill_Count2 + equip3.Skill_Count2;
                                                        if (skill_zero === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill2pow === 0 && skill_zero > 0) {
                                                                if (unit.Skill_Count2 + equip3.Skill_Count2 > 1) {
                                                                    IsOK = false;
                                                                    break;
                                                                }
                                                            }
                                                            else {
                                                                if (skill2pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill2pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            skill2 = true;
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 2) {
                                                        skill3pow = unit.Skill_Pow3 + title.Skill_Pow3 + equip1.Skill_Pow3 + equip2.Skill_Pow3 + equip3.Skill_Pow3;
                                                        skill_zero = unit.Skill_Count3 + title.Skill_Count3 + equip1.Skill_Count3 + equip2.Skill_Count3 + equip3.Skill_Count3;
                                                        if (skill_zero === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill3pow === 0 && skill_zero > 0) {
                                                                if (unit.Skill_Count3 + equip3.Skill_Count3 > 1) {
                                                                    IsOK = false;
                                                                    break;
                                                                }
                                                            }
                                                            else {
                                                                if (skill3pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill3pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            skill3 = true;
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 3) {
                                                        skill4pow = unit.Skill_Pow4 + title.Skill_Pow4 + equip1.Skill_Pow4 + equip2.Skill_Pow4 + equip3.Skill_Pow4;
                                                        skill_zero = unit.Skill_Count4 + title.Skill_Count4 + equip1.Skill_Count4 + equip2.Skill_Count4 + equip3.Skill_Count4;
                                                        if (skill_zero === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill4pow === 0 && skill_zero > 0) {
                                                                if (unit.Skill_Count4 + equip3.Skill_Count4 > 1) {
                                                                    IsOK = false;
                                                                    break;
                                                                }
                                                            }
                                                            else {
                                                                if (skill4pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill4pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            skill4 = true;
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 4) {
                                                        skill5pow = unit.Skill_Pow5 + title.Skill_Pow5 + equip1.Skill_Pow5 + equip2.Skill_Pow5 + equip3.Skill_Pow5;
                                                        skill_zero = unit.Skill_Count5 + title.Skill_Count5 + equip1.Skill_Count5 + equip2.Skill_Count5 + equip3.Skill_Count5;
                                                        if (skill_zero === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill5pow === 0 && skill_zero > 0) {
                                                                if (unit.Skill_Count5 + equip3.Skill_Count5 > 1) {
                                                                    IsOK = false;
                                                                    break;
                                                                }
                                                            }
                                                            else {
                                                                if (skill5pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill5pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            skill5 = true;
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 5) {
                                                        skill6pow = unit.Skill_Pow6 + title.Skill_Pow6 + equip1.Skill_Pow6 + equip2.Skill_Pow6 + equip3.Skill_Pow6;
                                                        skill_zero = unit.Skill_Count6 + title.Skill_Count6 + equip1.Skill_Count6 + equip2.Skill_Count6 + equip3.Skill_Count6;
                                                        if (skill_zero === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill6pow === 0 && skill_zero > 0) {
                                                                if (unit.Skill_Count6 + equip3.Skill_Count6 > 1) {
                                                                    IsOK = false;
                                                                    break;
                                                                }
                                                            }
                                                            else {
                                                                if (skill6pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill6pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            skill6 = true;
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 6) {
                                                        skill7pow = unit.Skill_Pow7 + title.Skill_Pow7 + equip1.Skill_Pow7 + equip2.Skill_Pow7 + equip3.Skill_Pow7;
                                                        skill_zero = unit.Skill_Count7 + title.Skill_Count7 + equip1.Skill_Count7 + equip2.Skill_Count7 + equip3.Skill_Count7;
                                                        if (skill_zero === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill7pow === 0 && skill_zero > 0) {
                                                                if (unit.Skill_Count7 + equip3.Skill_Count7 > 1) {
                                                                    IsOK = false;
                                                                    break;
                                                                }
                                                            }
                                                            else {
                                                                if (skill7pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill7pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            skill7 = true;
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 7) {
                                                        skill8pow = unit.Skill_Pow8 + title.Skill_Pow8 + equip1.Skill_Pow8 + equip2.Skill_Pow8 + equip3.Skill_Pow8;
                                                        skill_zero = unit.Skill_Count8 + title.Skill_Count8 + equip1.Skill_Count8 + equip2.Skill_Count8 + equip3.Skill_Count8;
                                                        if (skill_zero === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill8pow === 0 && skill_zero > 0) {
                                                                if (unit.Skill_Count8 + equip3.Skill_Count8 > 1) {
                                                                    IsOK = false;
                                                                    break;
                                                                }
                                                            }
                                                            else {
                                                                if (skill8pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill8pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            skill8 = true;
                                                            IsOK = true;
                                                        }
                                                    }
                                                    else if (i === 8) {
                                                        skill9pow = unit.Skill_Pow9 + title.Skill_Pow9 + equip1.Skill_Pow9 + equip2.Skill_Pow9 + equip3.Skill_Pow9;
                                                        skill_zero = unit.Skill_Count9 + title.Skill_Count9 + equip1.Skill_Count9 + equip2.Skill_Count9 + equip3.Skill_Count9;
                                                        if (skill_zero === 0) { IsOK = false; break; }
                                                        else {
                                                            if (skill9pow === 0 && skill_zero > 0) {
                                                                if (unit.Skill_Count9 + equip3.Skill_Count9 > 1) {
                                                                    IsOK = false;
                                                                    break;
                                                                }
                                                            }
                                                            else {
                                                                if (skill9pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                else if (skill9pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                            }
                                                            skill9 = true;
                                                            IsOK = true;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if (IsOK === false) continue;
                                        if (can_or) {
                                            for (let i = 0; i < 9; i++) {
                                                if (sim_setting[i].Name !== "") {
                                                    if (sim_setting[i].Can_Or === true) {
                                                        skill_zero = 0;
                                                        if (i === 0) {
                                                            skill1pow = unit.Skill_Pow1 + title.Skill_Pow1 + equip1.Skill_Pow1 + equip2.Skill_Pow1 + equip3.Skill_Pow1;
                                                            skill_zero = unit.Skill_Count1 + title.Skill_Count1 + equip1.Skill_Count1 + equip2.Skill_Count1 + equip3.Skill_Count1;
                                                            if (skill_zero === 0) { continue; }
                                                            else {
                                                                if (skill1pow === 0 && skill_zero > 0) {
                                                                    if (unit.Skill_Count1 + equip3.Skill_Count1 > 1) {
                                                                        IsOK = false;
                                                                        break;
                                                                    }
                                                                }
                                                                else {
                                                                    if (skill1pow > sim_setting[i].MaxPow) { continue; }
                                                                    else if (skill1pow < sim_setting[i].MinPow) { continue; }
                                                                }
                                                                if (IsOK_Or === true) {
                                                                    IsOK_Or = false;
                                                                    break;
                                                                }
                                                                skill1 = true;
                                                                IsOK_Or = true;
                                                            }
                                                        }
                                                        else if (i === 1) {
                                                            skill2pow = unit.Skill_Pow2 + title.Skill_Pow2 + equip1.Skill_Pow2 + equip2.Skill_Pow2 + equip3.Skill_Pow2;
                                                            skill_zero = unit.Skill_Count2 + title.Skill_Count2 + equip1.Skill_Count2 + equip2.Skill_Count2 + equip3.Skill_Count2;
                                                            if (skill_zero === 0) { continue; }
                                                            else {
                                                                if (skill2pow === 0 && skill_zero > 0) {
                                                                    if (unit.Skill_Count2 + equip3.Skill_Count2 > 1) {
                                                                        IsOK = false;
                                                                        break;
                                                                    }
                                                                }
                                                                else {
                                                                    if (skill2pow > sim_setting[i].MaxPow) { continue; }
                                                                    else if (skill2pow < sim_setting[i].MinPow) { continue; }
                                                                }
                                                                if (IsOK_Or === true) {
                                                                    IsOK_Or = false;
                                                                    break;
                                                                }
                                                                skill2 = true;
                                                                IsOK_Or = true;
                                                            }
                                                        }
                                                        else if (i === 2) {
                                                            skill3pow = unit.Skill_Pow3 + title.Skill_Pow3 + equip1.Skill_Pow3 + equip2.Skill_Pow3 + equip3.Skill_Pow3;
                                                            skill_zero = unit.Skill_Count3 + title.Skill_Count3 + equip1.Skill_Count3 + equip2.Skill_Count3 + equip3.Skill_Count3;
                                                            if (skill_zero === 0) { continue; }
                                                            else {
                                                                if (skill3pow === 0 && skill_zero > 0) {
                                                                    if (unit.Skill_Count3 + equip3.Skill_Count3 > 1) {
                                                                        IsOK = false;
                                                                        break;
                                                                    }
                                                                }
                                                                else {
                                                                    if (skill3pow > sim_setting[i].MaxPow) { continue; }
                                                                    else if (skill3pow < sim_setting[i].MinPow) { continue; }
                                                                }
                                                                if (IsOK_Or === true) {
                                                                    IsOK_Or = false;
                                                                    break;
                                                                }
                                                                skill3 = true;
                                                                IsOK_Or = true;
                                                            }
                                                        }
                                                        else if (i === 3) {
                                                            skill4pow = unit.Skill_Pow4 + title.Skill_Pow4 + equip1.Skill_Pow4 + equip2.Skill_Pow4 + equip3.Skill_Pow4;
                                                            skill_zero = unit.Skill_Count4 + title.Skill_Count4 + equip1.Skill_Count4 + equip2.Skill_Count4 + equip3.Skill_Count4;
                                                            if (skill_zero === 0) { continue; }
                                                            else {
                                                                if (skill4pow === 0 && skill_zero > 0) {
                                                                    if (unit.Skill_Count4 + equip3.Skill_Count4 > 1) {
                                                                        IsOK = false;
                                                                        break;
                                                                    }
                                                                }
                                                                else {
                                                                    if (skill4pow > sim_setting[i].MaxPow) { continue; }
                                                                    else if (skill4pow < sim_setting[i].MinPow) { continue; }
                                                                }
                                                                if (IsOK_Or === true) {
                                                                    IsOK_Or = false;
                                                                    break;
                                                                }
                                                                skill4 = true;
                                                                IsOK_Or = true;
                                                            }
                                                        }
                                                        else if (i === 4) {
                                                            skill5pow = unit.Skill_Pow5 + title.Skill_Pow5 + equip1.Skill_Pow5 + equip2.Skill_Pow5 + equip3.Skill_Pow5;
                                                            skill_zero = unit.Skill_Count5 + title.Skill_Count5 + equip1.Skill_Count5 + equip2.Skill_Count5 + equip3.Skill_Count5;
                                                            if (skill_zero === 0) { continue; }
                                                            else {
                                                                if (skill5pow === 0 && skill_zero > 0) {
                                                                    if (unit.Skill_Count5 + equip3.Skill_Count5 > 1) {
                                                                        IsOK = false;
                                                                        break;
                                                                    }
                                                                }
                                                                else {
                                                                    if (skill5pow > sim_setting[i].MaxPow) { continue; }
                                                                    else if (skill5pow < sim_setting[i].MinPow) { continue; }
                                                                }
                                                                if (IsOK_Or === true) {
                                                                    IsOK_Or = false;
                                                                    break;
                                                                }
                                                                skill5 = true;
                                                                IsOK_Or = true;
                                                            }
                                                        }
                                                        else if (i === 5) {
                                                            skill6pow = unit.Skill_Pow6 + title.Skill_Pow6 + equip1.Skill_Pow6 + equip2.Skill_Pow6 + equip3.Skill_Pow6;
                                                            skill_zero = unit.Skill_Count6 + title.Skill_Count6 + equip1.Skill_Count6 + equip2.Skill_Count6 + equip3.Skill_Count6;
                                                            if (skill_zero === 0) { continue; }
                                                            else {
                                                                if (skill6pow === 0 && skill_zero > 0) {
                                                                    if (unit.Skill_Count6 + equip3.Skill_Count6 > 1) {
                                                                        IsOK = false;
                                                                        break;
                                                                    }
                                                                }
                                                                else {
                                                                    if (skill6pow > sim_setting[i].MaxPow) { continue; }
                                                                    else if (skill6pow < sim_setting[i].MinPow) { continue; }
                                                                }
                                                                if (IsOK_Or === true) {
                                                                    IsOK_Or = false;
                                                                    break;
                                                                }
                                                                skill6 = true;
                                                                IsOK_Or = true;
                                                            }
                                                        }
                                                        else if (i === 6) {
                                                            skill7pow = unit.Skill_Pow7 + title.Skill_Pow7 + equip1.Skill_Pow7 + equip2.Skill_Pow7 + equip3.Skill_Pow7;
                                                            skill_zero = unit.Skill_Count7 + title.Skill_Count7 + equip1.Skill_Count7 + equip2.Skill_Count7 + equip3.Skill_Count7;
                                                            if (skill_zero === 0) { continue; }
                                                            else {
                                                                if (skill7pow === 0 && skill_zero > 0) {
                                                                    if (unit.Skill_Count7 + equip3.Skill_Count7 > 1) {
                                                                        IsOK = false;
                                                                        break;
                                                                    }
                                                                }
                                                                else {
                                                                    if (skill7pow > sim_setting[i].MaxPow) { continue; }
                                                                    else if (skill7pow < sim_setting[i].MinPow) { continue; }
                                                                }
                                                                if (IsOK_Or === true) {
                                                                    IsOK_Or = false;
                                                                    break;
                                                                }
                                                                skill7 = true;
                                                                IsOK_Or = true;
                                                            }
                                                        }
                                                        else if (i === 7) {
                                                            skill8pow = unit.Skill_Pow8 + title.Skill_Pow8 + equip1.Skill_Pow8 + equip2.Skill_Pow8 + equip3.Skill_Pow8;
                                                            skill_zero = unit.Skill_Count8 + title.Skill_Count8 + equip1.Skill_Count8 + equip2.Skill_Count8 + equip3.Skill_Count8;
                                                            if (skill_zero === 0) { continue; }
                                                            else {
                                                                if (skill8pow === 0 && skill_zero > 0) {
                                                                    if (unit.Skill_Count8 + equip3.Skill_Count8 > 1) {
                                                                        IsOK = false;
                                                                        break;
                                                                    }
                                                                }
                                                                else {
                                                                    if (skill8pow > sim_setting[i].MaxPow) { continue; }
                                                                    else if (skill8pow < sim_setting[i].MinPow) { continue; }
                                                                }
                                                                if (IsOK_Or === true) {
                                                                    IsOK_Or = false;
                                                                    break;
                                                                }
                                                                skill8 = true;
                                                                IsOK_Or = true;
                                                            }
                                                        }
                                                        else if (i === 8) {
                                                            skill9pow = unit.Skill_Pow9 + title.Skill_Pow9 + equip1.Skill_Pow9 + equip2.Skill_Pow9 + equip3.Skill_Pow9;
                                                            skill_zero = unit.Skill_Count9 + title.Skill_Count9 + equip1.Skill_Count9 + equip2.Skill_Count9 + equip3.Skill_Count9;
                                                            if (skill_zero === 0) { continue; }
                                                            else {
                                                                if (skill9pow === 0 && skill_zero > 0) {
                                                                    if (unit.Skill_Count9 + equip3.Skill_Count9 > 1) {
                                                                        IsOK = false;
                                                                        break;
                                                                    }
                                                                }
                                                                else {
                                                                    if (skill9pow > sim_setting[i].MaxPow) { continue; }
                                                                    else if (skill9pow < sim_setting[i].MinPow) { continue; }
                                                                }
                                                                if (IsOK_Or === true) {
                                                                    IsOK_Or = false;
                                                                    break;
                                                                }
                                                                skill9 = true;
                                                                IsOK_Or = true;
                                                            }
                                                        }
                                                        if (IsOK_Or === true) break;
                                                    }
                                                }
                                            }
                                            if (IsOK_Or === false) continue;
                                        }
                                        if (debug) {
                                            if (can_torehan) {
                                                if ((skill1pow - unit.Leader_Torehan) <= sim_setting[0].MinPow) { leader_only = true; }
                                                else { leader_only = false; }

                                                count_torehan++;
                                                const processed_item = {
                                                    Number: unit.Number,
                                                    TitlePrefix: title.Number,
                                                    TitleSuffix: 0,
                                                    Equip1Name: equip1.Number,
                                                    Equip2Name: equip2.Number,
                                                    Leader_Torehan: unit.Leader_Torehan,
                                                    Leader_Only: leader_only,
                                                    Limit_Equip1: equip1.Limit,
                                                    Limit_Equip2: equip2.Limit,

                                                    SimSkill1: skill1,
                                                    SimSkill2: skill2,
                                                    SimSkill3: skill3,
                                                    SimSkill4: skill4,
                                                    SimSkill5: skill5,
                                                    SimSkill6: skill6,
                                                    SimSkill7: skill7,
                                                    SimSkill8: skill8,
                                                    SimSkill9: skill9,
                                                    SimSkill1Pow: skill1pow,
                                                    SimSkill2Pow: skill2pow,
                                                    SimSkill3Pow: skill3pow,
                                                    SimSkill4Pow: skill4pow,
                                                    SimSkill5Pow: skill5pow,
                                                    SimSkill6Pow: skill6pow,
                                                    SimSkill7Pow: skill7pow,
                                                    SimSkill8Pow: skill8pow,
                                                    SimSkill9Pow: skill9pow,
                                                };
                                                result_unit_list.push(processed_item); }
                                            else {
                                                const processed_item = {
                                                    Number: unit.Number,
                                                    TitlePrefix: title.Number,
                                                    TitleSuffix: 0,
                                                    Equip1Name: equip1.Number,
                                                    Equip2Name: equip2.Number,
                                                    Equip3Name: equip3.Number,
                                                    Limit_Equip1: equip1.Limit,
                                                    Limit_Equip2: equip2.Limit,

                                                    SimSkill1: skill1,
                                                    SimSkill2: skill2,
                                                    SimSkill3: skill3,
                                                    SimSkill4: skill4,
                                                    SimSkill5: skill5,
                                                    SimSkill6: skill6,
                                                    SimSkill7: skill7,
                                                    SimSkill8: skill8,
                                                    SimSkill9: skill9,
                                                    SimSkill1Pow: skill1pow,
                                                    SimSkill2Pow: skill2pow,
                                                    SimSkill3Pow: skill3pow,
                                                    SimSkill4Pow: skill4pow,
                                                    SimSkill5Pow: skill5pow,
                                                    SimSkill6Pow: skill6pow,
                                                    SimSkill7Pow: skill7pow,
                                                    SimSkill8Pow: skill8pow,
                                                    SimSkill9Pow: skill9pow,
                                                }
                                                result_unit_list.push(processed_item);
                                            }
                                        }
                                        else {
                                            if (can_torehan) {
                                                if ((skill1pow - unit.Leader_Torehan) <= sim_setting[0].MinPow) { leader_only = true; }
                                                else { leader_only = false; }

                                                count_torehan++;
                                                const processed_item = {
                                                    IsVisible: true,
                                                    Number: unit.Number,
                                                    ImageNumber: unit.ImageNumber,
                                                    Name: unit.Name,
                                                    TitlePrefix: title.Name,
                                                    TitleSuffix: '',
                                                    Equip1Name: equip1.Name,
                                                    Equip2Name: equip2.Name,
                                                    List_Number: count_torehan,
                                                    Leader_Torehan: unit.Leader_Torehan,
                                                    Leader_Only: leader_only,
                                                    Limit_Equip1: equip1.Limit,
                                                    Limit_Equip2: equip2.Limit,

                                                    SimSkill1: skill1,
                                                    SimSkill2: skill2,
                                                    SimSkill3: skill3,
                                                    SimSkill4: skill4,
                                                    SimSkill5: skill5,
                                                    SimSkill6: skill6,
                                                    SimSkill7: skill7,
                                                    SimSkill8: skill8,
                                                    SimSkill9: skill9,
                                                    SimSkill1Pow: skill1pow,
                                                    SimSkill2Pow: skill2pow,
                                                    SimSkill3Pow: skill3pow,
                                                    SimSkill4Pow: skill4pow,
                                                    SimSkill5Pow: skill5pow,
                                                    SimSkill6Pow: skill6pow,
                                                    SimSkill7Pow: skill7pow,
                                                    SimSkill8Pow: skill8pow,
                                                    SimSkill9Pow: skill9pow,
                                                };
                                                result_unit_list.push(processed_item);
                                            }
                                            else {
                                                const processed_item = {
                                                    IsVisible: true,
                                                    Number: unit.Number,
                                                    ImageNumber: unit.ImageNumber,
                                                    Name: unit.Name,
                                                    TitlePrefix: title.Name,
                                                    Equip1Name: equip1.Name,
                                                    Equip2Name: equip2.Name,
                                                    Equip3Name: equip3.Name,
                                                    Limit_Equip1: equip1.Limit,
                                                    Limit_Equip2: equip2.Limit,

                                                    SimSkill1: skill1,
                                                    SimSkill2: skill2,
                                                    SimSkill3: skill3,
                                                    SimSkill4: skill4,
                                                    SimSkill5: skill5,
                                                    SimSkill6: skill6,
                                                    SimSkill7: skill7,
                                                    SimSkill8: skill8,
                                                    SimSkill9: skill9,
                                                    SimSkill1Pow: skill1pow,
                                                    SimSkill2Pow: skill2pow,
                                                    SimSkill3Pow: skill3pow,
                                                    SimSkill4Pow: skill4pow,
                                                    SimSkill5Pow: skill5pow,
                                                    SimSkill6Pow: skill6pow,
                                                    SimSkill7Pow: skill7pow,
                                                    SimSkill8Pow: skill8pow,
                                                    SimSkill9Pow: skill9pow,
                                                };
                                                result_unit_list.push(processed_item);
                                            }
                                        }
                                        if (result_unit_list.length > list_limit) {
                                            isCancelled = true;
                                            self.postMessage({
                                                type: 'cancelled',
                                                payload: { reason: 'cancelled by limit count' }
                                            });
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (is_common) {
                for (const unit of sim_unit_c) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                    if (!isCancelled) {
                        counter++;
                        self.postMessage({
                            type: 'progress',
                            payload: { currentIndex: counter }
                        });
                    }
                    IsOK = true;
                    for (let i = 0; i < 9; i++) {
                        if (sim_setting[i].Name !== "") {
                            if (sim_setting[i].Is_Reject === true) {
                                if (i === 0 && unit.Skill_Count1 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 1 && unit.Skill_Count2 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 2 && unit.Skill_Count3 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 3 && unit.Skill_Count4 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 4 && unit.Skill_Count5 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 5 && unit.Skill_Count6 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 6 && unit.Skill_Count7 > 0) {
                                    IsOK = false;
                                    break;
                                }
                                else if (i === 7 && unit.Skill_Count8 > 0) {
                                    IsOK = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (IsOK === false) continue;

                    for (const title1 of sim_title_c_pre) {
                        if (title1.Rank <= unit.GrowthRank) {
                            for (const title2 of sim_title_c_suf) {
                                if (title2.Rank <= unit.GrowthRank) {
                                    for (const equip1 of sim_equip1[unit.CategoryEquip1]) {
                                        for (const equip2 of sim_equip1[unit.CategoryEquip2]) {
                                            for (const equip3 of sim_equip3) {
                                                if (can_torehan && equip3.Name != "") {
                                                    continue;
                                                }
                                                //#region
                                                IsOK = false;
                                                IsOK_Or = false;
                                                skill1pow = 0;
                                                skill2pow = 0;
                                                skill3pow = 0;
                                                skill4pow = 0;
                                                skill5pow = 0;
                                                skill6pow = 0;
                                                skill7pow = 0;
                                                skill8pow = 0;
                                                skill9pow = 0;

                                                skill1 = false;
                                                skill2 = false;
                                                skill3 = false;
                                                skill4 = false;
                                                skill5 = false;
                                                skill6 = false;
                                                skill7 = false;
                                                skill8 = false;
                                                skill9 = false;
                                                filtercount = 0;
                                                skill_zero = 0;
                                                //#endregion
                                                filtercount = 0;
                                                if (filter_kago.length === 0 || filter_kago.includes("AllOn")) { IsOK = true; }
                                                else {
                                                    if (filter_kago_or) {
                                                        for (let i = 0; i < filter_kago.length; i++) {
                                                            if (title1.TitleKago1 !== "") {
                                                                if (title1.TitleKago1 === filter_kago[i]) {
                                                                    IsOK = true;
                                                                    break;
                                                                }
                                                            }
                                                            else if (unit.Kago1 === filter_kago[i]) {
                                                                IsOK = true;
                                                                break;
                                                            }
                                                            if (title2.TitleKago2 !== "") {
                                                                if (title2.TitleKago2 === filter_kago[i]) {
                                                                    IsOK = true;
                                                                    break;
                                                                }
                                                            }
                                                            else if (unit.Kago2 !== "") {
                                                                if (unit.Kago2 === filter_kago[i]) {
                                                                    IsOK = true;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if (filter_kago.length > 2) { }
                                                        else if (filter_kago.length === 1) {
                                                            if (title1.TitleKago1 !== "") {
                                                                if (title1.TitleKago1 === filter_kago[0]) {
                                                                    filtercount++;
                                                                }
                                                            }
                                                            else if (unit.Kago1 === filter_kago[0]) {
                                                                filtercount++;
                                                            }
                                                            if (title2.TitleKago2 !== "") {
                                                                if (title2.TitleKago2 === filter_kago[0]) {
                                                                    filtercount++;
                                                                }
                                                            }
                                                            else if (unit.Kago2 !== "") {
                                                                if (unit.Kago2 === filter_kago[0]) {
                                                                    filtercount++;
                                                                }
                                                            }
                                                            if (filtercount === 2) {
                                                                IsOK = true;
                                                            }
                                                        }
                                                        else {
                                                            for (let i = 0; i < filter_kago.length; i++) {
                                                                if (title1.TitleKago1 !== "") {
                                                                    if (title1.TitleKago1 === filter_kago[i]) {
                                                                        filtercount++;
                                                                        continue;
                                                                    }
                                                                }
                                                                else if (unit.Kago1 === filter_kago[i]) {
                                                                    filtercount++;
                                                                    continue;
                                                                }
                                                                if (title2.TitleKago2 !== "") {
                                                                    if (title2.TitleKago2 === filter_kago[i]) {
                                                                        filtercount++;
                                                                        continue;
                                                                    }
                                                                }
                                                                else if (unit.Kago2 !== "") {
                                                                    if (unit.Kago2 === filter_kago[i]) {
                                                                        filtercount++;
                                                                        continue;
                                                                    }
                                                                }
                                                                break;
                                                            }
                                                            if (filtercount === 2) {
                                                                IsOK = true;
                                                            }
                                                        }
                                                    }
                                                }
                                                if (IsOK === false) continue;

                                                IsOK = false;
                                                filtercount = 0;
                                                if (filter_slay.length === 0 || filter_slay.includes("AllOn")) { IsOK = true; }
                                                else {
                                                    if (filter_slay_or) {
                                                        for (let i = 0; i < filter_slay.length; i++) {
                                                            if (filter_slay[i] === "") {
                                                                if (unit.Slay === "" &&
                                                                    title1.TitleSlay1 === "" && title2.TitleSlay2 === "" &&
                                                                    equip1.EquipSlay1 === "" && equip1.EquipSlay2 === "" &&
                                                                    equip2.EquipSlay1 === "" && equip2.EquipSlay2 === "" &&
                                                                    equip3.EquipSlay1 === "") {
                                                                    IsOK = true;
                                                                    break;
                                                                }
                                                            }
                                                            else if (unit.Slay.includes(filter_slay[i]) ||
                                                                title1.TitleSlay1.includes(filter_slay[i]) ||
                                                                title2.TitleSlay2.includes(filter_slay[i]) ||
                                                                equip1.EquipSlay1.includes(filter_slay[i]) ||
                                                                equip1.EquipSlay2.includes(filter_slay[i]) ||
                                                                equip2.EquipSlay1.includes(filter_slay[i]) ||
                                                                equip2.EquipSlay2.includes(filter_slay[i]) ||
                                                                equip3.EquipSlay1.includes(filter_slay[i])) {
                                                                IsOK = true;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if (filter_slay.length === 1) {
                                                            if (filter_slay[0] === "") {
                                                                if (unit.Slay === "" &&
                                                                    title1.TitleSlay1 === "" && title2.TitleSlay2 === "" &&
                                                                    equip1.EquipSlay1 === "" && equip1.EquipSlay2 === "" &&
                                                                    equip2.EquipSlay1 === "" && equip2.EquipSlay2 === "" &&
                                                                    equip3.EquipSlay1 === "") {
                                                                    IsOK = true;
                                                                }
                                                            }
                                                            else {
                                                                if (unit.Slay.includes(filter_slay[0])) { filtercount++; }
                                                                if (title1.TitleSlay1.includes(filter_slay[0])) { filtercount++; }
                                                                if (title2.TitleSlay2.includes(filter_slay[0])) { filtercount++; }
                                                                if (equip1.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                                if (equip1.EquipSlay2.includes(filter_slay[0])) { filtercount++; }
                                                                if (equip2.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                                if (equip2.EquipSlay2.includes(filter_slay[0])) { filtercount++; }
                                                                if (equip3.EquipSlay1.includes(filter_slay[0])) { filtercount++; }
                                                                if (filtercount >= 2) IsOK = true;
                                                            }
                                                        }
                                                        else {
                                                            for (let i = 0; i < filter_slay.length; i++) {
                                                                if (unit.Slay.includes(filter_slay[i]) ||
                                                                    title1.TitleSlay1.includes(filter_slay[i]) ||
                                                                    title2.TitleSlay2.includes(filter_slay[i]) ||
                                                                    equip1.EquipSlay1.includes(filter_slay[i]) ||
                                                                    equip1.EquipSlay2.includes(filter_slay[i]) ||
                                                                    equip2.EquipSlay1.includes(filter_slay[i]) ||
                                                                    equip2.EquipSlay2.includes(filter_slay[i]) ||
                                                                    equip3.EquipSlay1.includes(filter_slay[i])) {
                                                                    filtercount++;
                                                                    continue;
                                                                }
                                                                break;
                                                            }
                                                            if (filter_slay.length === filtercount) {
                                                                IsOK = true;
                                                            }
                                                        }
                                                    }
                                                }
                                                if (IsOK === false) continue;

                                                if (has_gekiha) {
                                                    const all_numbers = [];
                                                    if (unit.Gekiha !== null) {
                                                        for (const uni of unit.Gekiha) {
                                                            all_numbers.push(uni);
                                                        }
                                                    }
                                                    if (title1.Gekiha1 !== 0) { all_numbers.push(title1.Gekiha1); }
                                                    if (title2.Gekiha2 !== 0) { all_numbers.push(title2.Gekiha2); }
                                                    if (equip1.Gekiha1 !== 0) { all_numbers.push(equip1.Gekiha1); }
                                                    if (equip1.Gekiha2 !== 0) { all_numbers.push(equip1.Gekiha2); }
                                                    if (equip2.Gekiha1 !== 0) { all_numbers.push(equip2.Gekiha1); }
                                                    if (equip2.Gekiha2 !== 0) { all_numbers.push(equip2.Gekiha2); }
                                                    if (equip3.Gekiha1 !== 0) { all_numbers.push(equip3.Gekiha1); }
                                                    if (all_numbers.length === 0) { continue; }

                                                    const check_power = [];
                                                    const used_numbers = [];

                                                    let check_count = 0;
                                                    if (await checkGekihaGurume(0, all_numbers, used_numbers, check_power, gekiha_setting)) {
                                                        for (let i = 0; i < 9; i++) {
                                                            if (sim_setting[i].Name === "撃破金運") {
                                                                if (i === 0) {
                                                                    skill1pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill1 = true;
                                                                }
                                                                else if (i === 1) {
                                                                    skill2pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill2 = true;
                                                                }
                                                                else if (i === 2) {
                                                                    skill3pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill3 = true;
                                                                }
                                                                else if (i === 3) {
                                                                    skill4pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill4 = true;
                                                                }
                                                                else if (i === 4) {
                                                                    skill5pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill5 = true;
                                                                }
                                                                else if (i === 5) {
                                                                    skill6pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill6 = true;
                                                                }
                                                                else if (i === 6) {
                                                                    skill7pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill7 = true;
                                                                }
                                                                else if (i === 7) {
                                                                    skill8pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill8 = true;
                                                                }
                                                                else if (i === 8) {
                                                                    skill9pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill9 = true;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else { continue; }
                                                }
                                                if (has_gurume) {
                                                    const all_numbers = [];
                                                    if (unit.Gurume !== null) {
                                                        for (const uni of unit.Gurume) {
                                                            all_numbers.push(uni);
                                                        }
                                                    }
                                                    if (title1.Gurume1 !== 0) { all_numbers.push(title1.Gurume1); }
                                                    if (title2.Gurume2 !== 0) { all_numbers.push(title2.Gurume2); }
                                                    if (equip1.Gurume1 !== 0) { all_numbers.push(equip1.Gurume1); }
                                                    if (equip1.Gurume2 !== 0) { all_numbers.push(equip1.Gurume2); }
                                                    if (equip2.Gurume1 !== 0) { all_numbers.push(equip2.Gurume1); }
                                                    if (equip2.Gurume2 !== 0) { all_numbers.push(equip2.Gurume2); }
                                                    if (equip3.Gurume1 !== 0) { all_numbers.push(equip3.Gurume1); }
                                                    if (all_numbers.length === 0) { continue; }

                                                    const check_power = [];
                                                    const used_numbers = [];

                                                    let check_count = 0;
                                                    if (await checkGekihaGurume(0, all_numbers, used_numbers, check_power, gurume_setting)) {
                                                        for (let i = 0; i < 9; i++) {
                                                            if (sim_setting[i].Name === "グルメ魂") {
                                                                if (i === 0) {
                                                                    skill1pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill1 = true;
                                                                }
                                                                else if (i === 1) {
                                                                    skill2pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill2 = true;
                                                                }
                                                                else if (i === 2) {
                                                                    skill3pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill3 = true;
                                                                }
                                                                else if (i === 3) {
                                                                    skill4pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill4 = true;
                                                                }
                                                                else if (i === 4) {
                                                                    skill5pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill5 = true;
                                                                }
                                                                else if (i === 5) {
                                                                    skill6pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill6 = true;
                                                                }
                                                                else if (i === 6) {
                                                                    skill7pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill7 = true;
                                                                }
                                                                else if (i === 7) {
                                                                    skill8pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill8 = true;
                                                                }
                                                                else if (i === 8) {
                                                                    skill9pow = check_power[check_count];
                                                                    check_count++;
                                                                    skill9 = true;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else { continue; }
                                                }

                                                for (let i = 0; i < 9; i++) {
                                                    if (sim_setting[i].Name !== "") {
                                                        if (sim_setting[i].Can_Or === true || sim_setting[i].Is_Reject === true) continue;
                                                        skill_zero = 0;
                                                        IsOK = false;
                                                        if (sim_setting[i].Name === "撃破金運" || sim_setting[i].Name === "グルメ魂") {
                                                            IsOK = true;
                                                        }
                                                        else {
                                                            if (i === 0) {
                                                                skill1pow = unit.Skill_Pow1 + title1.Skill_Pow1 + title2.Skill_Pow1 + equip1.Skill_Pow1 + equip2.Skill_Pow1 + equip3.Skill_Pow1;
                                                                skill_zero = unit.Skill_Count1 + title1.Skill_Count1 + title2.Skill_Count1 + equip1.Skill_Count1 + equip2.Skill_Count1 + equip3.Skill_Count1;
                                                                if (skill_zero === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill1pow === 0 && skill_zero > 0) {
                                                                        if (unit.Skill_Count1 + title1.Skill_Count1 + title2.Skill_Count1 + equip3.Skill_Count1 > 1) {
                                                                            IsOK = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (skill1pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill1pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                    skill1 = true;
                                                                }
                                                            }
                                                            else if (i === 1) {
                                                                skill2pow = unit.Skill_Pow2 + title1.Skill_Pow2 + title2.Skill_Pow2 + equip1.Skill_Pow2 + equip2.Skill_Pow2 + equip3.Skill_Pow2;
                                                                skill_zero = unit.Skill_Count2 + title1.Skill_Count2 + title2.Skill_Count2 + equip1.Skill_Count2 + equip2.Skill_Count2 + equip3.Skill_Count2;
                                                                if (skill_zero === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill2pow === 0 && skill_zero > 0) {
                                                                        if (unit.Skill_Count2 + title1.Skill_Count2 + title2.Skill_Count2 + equip3.Skill_Count2 > 1) {
                                                                            IsOK = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (skill2pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill2pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                    skill2 = true;
                                                                }
                                                            }
                                                            else if (i === 2) {
                                                                skill3pow = unit.Skill_Pow3 + title1.Skill_Pow3 + title2.Skill_Pow3 + equip1.Skill_Pow3 + equip2.Skill_Pow3 + equip3.Skill_Pow3;
                                                                skill_zero = unit.Skill_Count3 + title1.Skill_Count3 + title2.Skill_Count3 + equip1.Skill_Count3 + equip2.Skill_Count3 + equip3.Skill_Count3;
                                                                if (skill_zero === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill3pow === 0 && skill_zero > 0) {
                                                                        if (unit.Skill_Count3 + title1.Skill_Count3 + title2.Skill_Count3 + equip3.Skill_Count3 > 1) {
                                                                            IsOK = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (skill3pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill3pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                    skill3 = true;
                                                                }
                                                            }
                                                            else if (i === 3) {
                                                                skill4pow = unit.Skill_Pow4 + title1.Skill_Pow4 + title2.Skill_Pow4 + equip1.Skill_Pow4 + equip2.Skill_Pow4 + equip3.Skill_Pow4;
                                                                skill_zero = unit.Skill_Count4 + title1.Skill_Count4 + title2.Skill_Count4 + equip1.Skill_Count4 + equip2.Skill_Count4 + equip3.Skill_Count4;
                                                                if (skill_zero === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill4pow === 0 && skill_zero > 0) {
                                                                        if (unit.Skill_Count4 + title1.Skill_Count4 + title2.Skill_Count4 + equip3.Skill_Count4 > 1) {
                                                                            IsOK = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (skill4pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill4pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                    skill4 = true;
                                                                }
                                                            }
                                                            else if (i === 4) {
                                                                skill5pow = unit.Skill_Pow5 + title1.Skill_Pow5 + title2.Skill_Pow5 + equip1.Skill_Pow5 + equip2.Skill_Pow5 + equip3.Skill_Pow5;
                                                                skill_zero = unit.Skill_Count5 + title1.Skill_Count5 + title2.Skill_Count5 + equip1.Skill_Count5 + equip2.Skill_Count5 + equip3.Skill_Count5;
                                                                if (skill_zero === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill5pow === 0 && skill_zero > 0) {
                                                                        if (unit.Skill_Count5 + title1.Skill_Count5 + title2.Skill_Count5 + equip3.Skill_Count5 > 1) {
                                                                            IsOK = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (skill5pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill5pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                    skill5 = true;
                                                                }
                                                            }
                                                            else if (i === 5) {
                                                                skill6pow = unit.Skill_Pow6 + title1.Skill_Pow6 + title2.Skill_Pow6 + equip1.Skill_Pow6 + equip2.Skill_Pow6 + equip3.Skill_Pow6;
                                                                skill_zero = unit.Skill_Count6 + title1.Skill_Count6 + title2.Skill_Count6 + equip1.Skill_Count6 + equip2.Skill_Count6 + equip3.Skill_Count6;
                                                                if (skill_zero === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill6pow === 0 && skill_zero > 0) {
                                                                        if (unit.Skill_Count6 + title1.Skill_Count6 + title2.Skill_Count6 + equip3.Skill_Count6 > 1) {
                                                                            IsOK = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (skill6pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill6pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                    skill6 = true;
                                                                }
                                                            }
                                                            else if (i === 6) {
                                                                skill7pow = unit.Skill_Pow7 + title1.Skill_Pow7 + title2.Skill_Pow7 + equip1.Skill_Pow7 + equip2.Skill_Pow7 + equip3.Skill_Pow7;
                                                                skill_zero = unit.Skill_Count7 + title1.Skill_Count7 + title2.Skill_Count7 + equip1.Skill_Count7 + equip2.Skill_Count7 + equip3.Skill_Count7;
                                                                if (skill_zero === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill7pow === 0 && skill_zero > 0) {
                                                                        if (unit.Skill_Count7 + title1.Skill_Count7 + title2.Skill_Count7 + equip3.Skill_Count7 > 1) {
                                                                            IsOK = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (skill7pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill7pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                    skill7 = true;
                                                                }
                                                            }
                                                            else if (i === 7) {
                                                                skill8pow = unit.Skill_Pow8 + title1.Skill_Pow8 + title2.Skill_Pow8 + equip1.Skill_Pow8 + equip2.Skill_Pow8 + equip3.Skill_Pow8;
                                                                skill_zero = unit.Skill_Count8 + title1.Skill_Count8 + title2.Skill_Count8 + equip1.Skill_Count8 + equip2.Skill_Count8 + equip3.Skill_Count8;
                                                                if (skill_zero === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill8pow === 0 && skill_zero > 0) {
                                                                        if (unit.Skill_Count8 + title1.Skill_Count8 + title2.Skill_Count8 + equip3.Skill_Count8 > 1) {
                                                                            IsOK = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (skill8pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill8pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                    skill8 = true;
                                                                }
                                                            }
                                                            else if (i === 8) {
                                                                skill9pow = unit.Skill_Pow9 + title1.Skill_Pow9 + title2.Skill_Pow9 + equip1.Skill_Pow9 + equip2.Skill_Pow9 + equip3.Skill_Pow9;
                                                                skill_zero = unit.Skill_Count9 + title1.Skill_Count9 + title2.Skill_Count9 + equip1.Skill_Count9 + equip2.Skill_Count9 + equip3.Skill_Count9;
                                                                if (skill_zero === 0) { IsOK = false; break; }
                                                                else {
                                                                    if (skill9pow === 0 && skill_zero > 0) {
                                                                        if (unit.Skill_Count9 + title1.Skill_Count9 + title2.Skill_Count9 + equip3.Skill_Count9 > 1) {
                                                                            IsOK = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (skill9pow > sim_setting[i].MaxPow) { IsOK = false; break; }
                                                                        else if (skill9pow < sim_setting[i].MinPow) { IsOK = false; break; }
                                                                    }
                                                                    IsOK = true;
                                                                    skill9 = true;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                if (IsOK === false) continue;
                                                if (can_or) {
                                                    for (let i = 0; i < 9; i++) {
                                                        if (sim_setting[i].Name !== "") {
                                                            if (sim_setting[i].Can_Or === true) {
                                                                skill_zero = 0;

                                                                if (i === 0) {
                                                                    skill1pow = unit.Skill_Pow1 + title1.Skill_Pow1 + title2.Skill_Pow1 + equip1.Skill_Pow1 + equip2.Skill_Pow1 + equip3.Skill_Pow1;
                                                                    skill_zero = unit.Skill_Count1 + title1.Skill_Count1 + title2.Skill_Count1 + equip1.Skill_Count1 + equip2.Skill_Count1 + equip3.Skill_Count1;
                                                                    if (skill_zero === 0) { continue; }
                                                                    else {
                                                                        if (skill1pow === 0 && skill_zero > 0) {
                                                                            if (unit.Skill_Count1 + title1.Skill_Count1 + title2.Skill_Count1 + equip3.Skill_Count1 > 1) {
                                                                                IsOK = false;
                                                                                break;
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (skill1pow > sim_setting[i].MaxPow) { continue; }
                                                                            else if (skill1pow < sim_setting[i].MinPow) { continue; }
                                                                        }
                                                                        if (IsOK_Or === true) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                        IsOK_Or = true;
                                                                        skill1 = true;
                                                                    }
                                                                }
                                                                else if (i === 1) {
                                                                    if (IsOK_Or === true) {
                                                                        if (title1.Skill_Count2 + title2.Skill_Count2 > 0) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    skill2pow = unit.Skill_Pow2 + title1.Skill_Pow2 + title2.Skill_Pow2 + equip1.Skill_Pow2 + equip2.Skill_Pow2 + equip3.Skill_Pow2;
                                                                    skill_zero = unit.Skill_Count2 + title1.Skill_Count2 + title2.Skill_Count2 + equip1.Skill_Count2 + equip2.Skill_Count2 + equip3.Skill_Count2;
                                                                    if (skill_zero === 0) { continue; }
                                                                    else {
                                                                        if (skill2pow === 0 && skill_zero > 0) {
                                                                            if (unit.Skill_Count2 + title1.Skill_Count2 + title2.Skill_Count2 + equip3.Skill_Count2 > 1) {
                                                                                IsOK = false;
                                                                                break;
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (skill2pow > sim_setting[i].MaxPow) { continue; }
                                                                            else if (skill2pow < sim_setting[i].MinPow) { continue; }
                                                                        }
                                                                        if (IsOK_Or === true) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                        IsOK_Or = true;
                                                                        skill2 = true;
                                                                    }
                                                                }
                                                                else if (i === 2) {
                                                                    if (IsOK_Or === true) {
                                                                        if (title1.Skill_Count3 + title2.Skill_Count3 > 0) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    skill3pow = unit.Skill_Pow3 + title1.Skill_Pow3 + title2.Skill_Pow3 + equip1.Skill_Pow3 + equip2.Skill_Pow3 + equip3.Skill_Pow3;
                                                                    skill_zero = unit.Skill_Count3 + title1.Skill_Count3 + title2.Skill_Count3 + equip1.Skill_Count3 + equip2.Skill_Count3 + equip3.Skill_Count3;
                                                                    if (skill_zero === 0) { continue; }
                                                                    else {
                                                                        if (skill3pow === 0 && skill_zero > 0) {
                                                                            if (unit.Skill_Count3 + title1.Skill_Count3 + title2.Skill_Count3 + equip3.Skill_Count3 > 1) {
                                                                                IsOK = false;
                                                                                break;
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (skill3pow > sim_setting[i].MaxPow) { continue; }
                                                                            else if (skill3pow < sim_setting[i].MinPow) { continue; }
                                                                        }
                                                                        if (IsOK_Or === true) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                        IsOK_Or = true;
                                                                        skill3 = true;
                                                                    }
                                                                }
                                                                else if (i === 3) {
                                                                    if (IsOK_Or === true) {
                                                                        if (title1.Skill_Count4 + title2.Skill_Count4 > 0) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    skill4pow = unit.Skill_Pow4 + title1.Skill_Pow4 + title2.Skill_Pow4 + equip1.Skill_Pow4 + equip2.Skill_Pow4 + equip3.Skill_Pow4;
                                                                    skill_zero = unit.Skill_Count4 + title1.Skill_Count4 + title2.Skill_Count4 + equip1.Skill_Count4 + equip2.Skill_Count4 + equip3.Skill_Count4;
                                                                    if (skill_zero === 0) { continue; }
                                                                    else {
                                                                        if (skill4pow === 0 && skill_zero > 0) {
                                                                            if (unit.Skill_Count4 + title1.Skill_Count4 + title2.Skill_Count4 + equip3.Skill_Count4 > 1) {
                                                                                IsOK = false;
                                                                                break;
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (skill4pow > sim_setting[i].MaxPow) { continue; }
                                                                            else if (skill4pow < sim_setting[i].MinPow) { continue; }
                                                                        }
                                                                        if (IsOK_Or === true) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                        IsOK_Or = true;
                                                                        skill4 = true;
                                                                    }
                                                                }
                                                                else if (i === 4) {
                                                                    if (IsOK_Or === true) {
                                                                        if (title1.Skill_Count5 + title2.Skill_Count5 > 0) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    skill5pow = unit.Skill_Pow5 + title1.Skill_Pow5 + title2.Skill_Pow5 + equip1.Skill_Pow5 + equip2.Skill_Pow5 + equip3.Skill_Pow5;
                                                                    skill_zero = unit.Skill_Count5 + title1.Skill_Count5 + title2.Skill_Count5 + equip1.Skill_Count5 + equip2.Skill_Count5 + equip3.Skill_Count5;
                                                                    if (skill_zero === 0) { continue; }
                                                                    else {
                                                                        if (skill5pow === 0 && skill_zero > 0) {
                                                                            if (unit.Skill_Count5 + title1.Skill_Count5 + title2.Skill_Count5 + equip3.Skill_Count5 > 1) {
                                                                                IsOK = false;
                                                                                break;
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (skill5pow > sim_setting[i].MaxPow) { continue; }
                                                                            else if (skill5pow < sim_setting[i].MinPow) { continue; }
                                                                        }
                                                                        if (IsOK_Or === true) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                        IsOK_Or = true;
                                                                        skill5 = true;
                                                                    }
                                                                }
                                                                else if (i === 5) {
                                                                    if (IsOK_Or === true) {
                                                                        if (title1.Skill_Count6 + title2.Skill_Count6 > 0) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    skill6pow = unit.Skill_Pow6 + title1.Skill_Pow6 + title2.Skill_Pow6 + equip1.Skill_Pow6 + equip2.Skill_Pow6 + equip3.Skill_Pow6;
                                                                    skill_zero = unit.Skill_Count6 + title1.Skill_Count6 + title2.Skill_Count6 + equip1.Skill_Count6 + equip2.Skill_Count6 + equip3.Skill_Count6;
                                                                    if (skill_zero === 0) { continue; }
                                                                    else {
                                                                        if (skill6pow === 0 && skill_zero > 0) {
                                                                            if (unit.Skill_Count6 + title1.Skill_Count6 + title2.Skill_Count6 + equip3.Skill_Count6 > 1) {
                                                                                IsOK = false;
                                                                                break;
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (skill6pow > sim_setting[i].MaxPow) { continue; }
                                                                            else if (skill6pow < sim_setting[i].MinPow) { continue; }
                                                                        }
                                                                        if (IsOK_Or === true) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                        IsOK_Or = true;
                                                                        skill6 = true;
                                                                    }
                                                                }
                                                                else if (i === 6) {
                                                                    if (IsOK_Or === true) {
                                                                        if (title1.Skill_Count7 + title2.Skill_Count7 > 0) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    skill7pow = unit.Skill_Pow7 + title1.Skill_Pow7 + title2.Skill_Pow7 + equip1.Skill_Pow7 + equip2.Skill_Pow7 + equip3.Skill_Pow7;
                                                                    skill_zero = unit.Skill_Count7 + title1.Skill_Count7 + title2.Skill_Count7 + equip1.Skill_Count7 + equip2.Skill_Count7 + equip3.Skill_Count7;
                                                                    if (skill_zero === 0) { continue; }
                                                                    else {
                                                                        if (skill7pow === 0 && skill_zero > 0) {
                                                                            if (unit.Skill_Count7 + title1.Skill_Count7 + title2.Skill_Count7 + equip3.Skill_Count7 > 1) {
                                                                                IsOK = false;
                                                                                break;
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (skill7pow > sim_setting[i].MaxPow) { continue; }
                                                                            else if (skill7pow < sim_setting[i].MinPow) { continue; }
                                                                        }
                                                                        if (IsOK_Or === true) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                        IsOK_Or = true;
                                                                        skill7 = true;
                                                                    }
                                                                }
                                                                else if (i === 7) {
                                                                    if (IsOK_Or === true) {
                                                                        if (title1.Skill_Count8 + title2.Skill_Count8 > 0) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    skill8pow = unit.Skill_Pow8 + title1.Skill_Pow8 + title2.Skill_Pow8 + equip1.Skill_Pow8 + equip2.Skill_Pow8 + equip3.Skill_Pow8;
                                                                    skill_zero = unit.Skill_Count8 + title1.Skill_Count8 + title2.Skill_Count8 + equip1.Skill_Count8 + equip2.Skill_Count8 + equip3.Skill_Count8;
                                                                    if (skill_zero === 0) { continue; }
                                                                    else {
                                                                        if (skill8pow === 0 && skill_zero > 0) {
                                                                            if (unit.Skill_Count8 + title1.Skill_Count8 + title2.Skill_Count8 + equip3.Skill_Count8 > 1) {
                                                                                IsOK = false;
                                                                                break;
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (skill8pow > sim_setting[i].MaxPow) { continue; }
                                                                            else if (skill8pow < sim_setting[i].MinPow) { continue; }
                                                                        }
                                                                        if (IsOK_Or === true) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                        IsOK_Or = true;
                                                                        skill8 = true;
                                                                    }
                                                                }
                                                                else if (i === 8) {
                                                                    if (IsOK_Or === true) {
                                                                        if (title1.Skill_Count9 + title2.Skill_Count9 > 0) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                    }
                                                                    skill9pow = unit.Skill_Pow9 + title1.Skill_Pow9 + title2.Skill_Pow9 + equip1.Skill_Pow9 + equip2.Skill_Pow9 + equip3.Skill_Pow9;
                                                                    skill_zero = unit.Skill_Count9 + title1.Skill_Count9 + title2.Skill_Count9 + equip1.Skill_Count9 + equip2.Skill_Count9 + equip3.Skill_Count9;
                                                                    if (skill_zero === 0) { continue; }
                                                                    else {
                                                                        if (skill9pow === 0 && skill_zero > 0) {
                                                                            if (unit.Skill_Count9 + title1.Skill_Count9 + title2.Skill_Count9 + equip3.Skill_Count9 > 1) {
                                                                                IsOK = false;
                                                                                break;
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (skill9pow > sim_setting[i].MaxPow) { continue; }
                                                                            else if (skill9pow < sim_setting[i].MinPow) { continue; }
                                                                        }
                                                                        if (IsOK_Or === true) {
                                                                            IsOK_Or = false;
                                                                            break;
                                                                        }
                                                                        IsOK_Or = true;
                                                                        skill9 = true;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (IsOK_Or === false) continue;
                                                }
                                                if (debug) {
                                                    if (can_torehan) {
                                                        if ((skill1pow - unit.Leader_Torehan) < sim_setting[0].MinPow) { leader_only = true; }
                                                        else { leader_only = false; }

                                                        count_torehan++;
                                                        const processed_item = {
                                                            Number: unit.Number,
                                                            TitlePrefix: title1.Number,
                                                            TitleSuffix: title2.Number,
                                                            Equip1Name: equip1.Number,
                                                            Equip2Name: equip2.Number,
                                                            Leader_Torehan: unit.Leader_Torehan,
                                                            Leader_Only: leader_only,
                                                            Limit_Equip1: equip1.Limit,
                                                            Limit_Equip2: equip2.Limit,

                                                            SimSkill1: skill1,
                                                            SimSkill2: skill2,
                                                            SimSkill3: skill3,
                                                            SimSkill4: skill4,
                                                            SimSkill5: skill5,
                                                            SimSkill6: skill6,
                                                            SimSkill7: skill7,
                                                            SimSkill8: skill8,
                                                            SimSkill9: skill9,
                                                            SimSkill1Pow: skill1pow,
                                                            SimSkill2Pow: skill2pow,
                                                            SimSkill3Pow: skill3pow,
                                                            SimSkill4Pow: skill4pow,
                                                            SimSkill5Pow: skill5pow,
                                                            SimSkill6Pow: skill6pow,
                                                            SimSkill7Pow: skill7pow,
                                                            SimSkill8Pow: skill8pow,
                                                            SimSkill9Pow: skill9pow,
                                                        };
                                                        result_unit_list.push(processed_item);
                                                    }
                                                    else {
                                                        const processed_item = {
                                                            Number: unit.Number,
                                                            TitlePrefix: title1.Number,
                                                            TitleSuffix: title2.Number,
                                                            Equip1Name: equip1.Number,
                                                            Equip2Name: equip2.Number,
                                                            Equip3Name: equip3.Number,
                                                            Limit_Equip1: equip1.Limit,
                                                            Limit_Equip2: equip2.Limit,

                                                            SimSkill1: skill1,
                                                            SimSkill2: skill2,
                                                            SimSkill3: skill3,
                                                            SimSkill4: skill4,
                                                            SimSkill5: skill5,
                                                            SimSkill6: skill6,
                                                            SimSkill7: skill7,
                                                            SimSkill8: skill8,
                                                            SimSkill9: skill9,
                                                            SimSkill1Pow: skill1pow,
                                                            SimSkill2Pow: skill2pow,
                                                            SimSkill3Pow: skill3pow,
                                                            SimSkill4Pow: skill4pow,
                                                            SimSkill5Pow: skill5pow,
                                                            SimSkill6Pow: skill6pow,
                                                            SimSkill7Pow: skill7pow,
                                                            SimSkill8Pow: skill8pow,
                                                            SimSkill9Pow: skill9pow,
                                                        };
                                                        result_unit_list.push(processed_item);
                                                    }
                                                }
                                                else {
                                                    if (can_torehan === true) {
                                                        if ((skill1pow - unit.Leader_Torehan) < sim_setting[0].MinPow) { leader_only = true; }
                                                        else { leader_only = false; }

                                                        count_torehan++;
                                                        const processed_item = {
                                                            IsVisible: true,
                                                            Number: unit.Number,
                                                            ImageNumber: unit.ImageNumber,
                                                            Name: unit.Name,
                                                            TitlePrefix: title1.Name,
                                                            TitleSuffix: title2.Name,
                                                            Equip1Name: equip1.Name,
                                                            Equip2Name: equip2.Name,
                                                            List_Number: count_torehan,
                                                            Leader_Torehan: unit.Leader_Torehan,
                                                            Leader_Only: leader_only,
                                                            Limit_Equip1: equip1.Limit,
                                                            Limit_Equip2: equip2.Limit,

                                                            SimSkill1: skill1,
                                                            SimSkill2: skill2,
                                                            SimSkill3: skill3,
                                                            SimSkill4: skill4,
                                                            SimSkill5: skill5,
                                                            SimSkill6: skill6,
                                                            SimSkill7: skill7,
                                                            SimSkill8: skill8,
                                                            SimSkill9: skill9,
                                                            SimSkill1Pow: skill1pow,
                                                            SimSkill2Pow: skill2pow,
                                                            SimSkill3Pow: skill3pow,
                                                            SimSkill4Pow: skill4pow,
                                                            SimSkill5Pow: skill5pow,
                                                            SimSkill6Pow: skill6pow,
                                                            SimSkill7Pow: skill7pow,
                                                            SimSkill8Pow: skill8pow,
                                                            SimSkill9Pow: skill9pow,
                                                        };
                                                        result_unit_list.push(processed_item);
                                                    }
                                                    else {
                                                        const processed_item = {
                                                            IsVisible: true,
                                                            Number: unit.Number,
                                                            ImageNumber: unit.ImageNumber,
                                                            Name: unit.Name,
                                                            TitlePrefix: title1.Name,
                                                            TitleSuffix: title2.Name,
                                                            Equip1Name: equip1.Name,
                                                            Equip2Name: equip2.Name,
                                                            Equip3Name: equip3.Name,
                                                            Limit_Equip1: equip1.Limit,
                                                            Limit_Equip2: equip2.Limit,

                                                            SimSkill1: skill1,
                                                            SimSkill2: skill2,
                                                            SimSkill3: skill3,
                                                            SimSkill4: skill4,
                                                            SimSkill5: skill5,
                                                            SimSkill6: skill6,
                                                            SimSkill7: skill7,
                                                            SimSkill8: skill8,
                                                            SimSkill9: skill9,
                                                            SimSkill1Pow: skill1pow,
                                                            SimSkill2Pow: skill2pow,
                                                            SimSkill3Pow: skill3pow,
                                                            SimSkill4Pow: skill4pow,
                                                            SimSkill5Pow: skill5pow,
                                                            SimSkill6Pow: skill6pow,
                                                            SimSkill7Pow: skill7pow,
                                                            SimSkill8Pow: skill8pow,
                                                            SimSkill9Pow: skill9pow,
                                                        };
                                                        result_unit_list.push(processed_item);
                                                    }
                                                }

                                                if (result_unit_list.length > list_limit) {
                                                    isCancelled = true;
                                                    self.postMessage({
                                                        type: 'cancelled',
                                                        payload: { reason: `${result_unit_list.length}体` }
                                                    });
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if (can_torehan) {
                await new Promise(resolve => setTimeout(resolve, 1));
                self.postMessage({
                    type: 'preresult',
                    payload: { message: '編成中' }
                });
                await new Promise(resolve => setTimeout(resolve, 1));

                const result_torehan_party_list = await testTorehan(result_unit_list, list_limit);


                if (result_torehan_party_list == null) {
                    isCancelled = true;
                    self.postMessage({
                        type: 'cancelled',
                        payload: { reason: `6体揃いませんでした。` }
                    });
                    return;
                }
                if (result_torehan_party_list.length > list_limit / 10) {
                    isCancelled = true;
                    self.postMessage({
                        type: 'cancelled',
                        payload: { reason: `${result_torehan_party_list.length}師団` }
                    });
                    return;
                }

                if (!isCancelled) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                    self.postMessage({
                        type: 'preresult',
                        payload: { message: '最終処理中' }
                    });
                    await new Promise(resolve => setTimeout(resolve, 1));

                    const numElements = result_torehan_party_list.length * 6;

                    const BOOL_BYTE = 1;
                    const INT_BYTE = 2;
                    const BYTES_PER_ELEMENT = 2 + 4 + 6 + 9 + 18;


                    const arrayBuffer = new ArrayBuffer(numElements * BYTES_PER_ELEMENT);
                    const dataView = new DataView(arrayBuffer);
                    let offset = 0;
                    for (const party of result_torehan_party_list) {
                        for (const item of party) {
                            //#region
                            dataView.setUint16(offset, item.Number, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.TitlePrefix, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.TitleSuffix, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.Equip1Name, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.Equip2Name, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.Equip3Name, true);
                            offset += INT_BYTE;

                            dataView.setInt8(offset, item.SimSkill1 ? 1 : 0);
                            offset += BOOL_BYTE;
                            dataView.setInt8(offset, item.SimSkill2 ? 1 : 0);
                            offset += BOOL_BYTE;
                            dataView.setInt8(offset, item.SimSkill3 ? 1 : 0);
                            offset += BOOL_BYTE;
                            dataView.setInt8(offset, item.SimSkill4 ? 1 : 0);
                            offset += BOOL_BYTE;
                            dataView.setInt8(offset, item.SimSkill5 ? 1 : 0);
                            offset += BOOL_BYTE;
                            dataView.setInt8(offset, item.SimSkill6 ? 1 : 0);
                            offset += BOOL_BYTE;
                            dataView.setInt8(offset, item.SimSkill7 ? 1 : 0);
                            offset += BOOL_BYTE;
                            dataView.setInt8(offset, item.SimSkill8 ? 1 : 0);
                            offset += BOOL_BYTE;
                            dataView.setInt8(offset, item.SimSkill9 ? 1 : 0);
                            offset += BOOL_BYTE;

                            dataView.setUint16(offset, item.SimSkill1Pow, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.SimSkill2Pow, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.SimSkill3Pow, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.SimSkill4Pow, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.SimSkill5Pow, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.SimSkill6Pow, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.SimSkill7Pow, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.SimSkill8Pow, true);
                            offset += INT_BYTE;
                            dataView.setUint16(offset, item.SimSkill9Pow, true);
                            offset += INT_BYTE;
                            //#endregion
                        }
                    }

                    const message = {
                        type: 'torehan',
                        data: {
                            arrayId: 'sim_torehan_list',
                            length: numElements,
                            dataBuffer: arrayBuffer
                        }
                    };
                    self.postMessage(message, [arrayBuffer]);
                }
            }
            else {
                if (!isCancelled) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                    self.postMessage({
                        type: 'preresult',
                        payload: { message: '最終処理中' }
                    });
                    await new Promise(resolve => setTimeout(resolve, 1));
                    const numElements = result_unit_list.length;

                    const BOOL_BYTE = 1;
                    const INT_BYTE = 2;
                    const BYTES_PER_ELEMENT = 2 + 4 + 6 + 9 + 18;

                    const arrayBuffer = new ArrayBuffer(numElements * BYTES_PER_ELEMENT);
                    const dataView = new DataView(arrayBuffer);
                    let offset = 0;

                    for (const item of result_unit_list) {
                        //#region
                        dataView.setUint16(offset, item.Number, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.TitlePrefix, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.TitleSuffix, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.Equip1Name, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.Equip2Name, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.Equip3Name, true);
                        offset += INT_BYTE;

                        dataView.setInt8(offset, item.SimSkill1 ? 1 : 0);
                        offset += BOOL_BYTE;
                        dataView.setInt8(offset, item.SimSkill2 ? 1 : 0);
                        offset += BOOL_BYTE;
                        dataView.setInt8(offset, item.SimSkill3 ? 1 : 0);
                        offset += BOOL_BYTE;
                        dataView.setInt8(offset, item.SimSkill4 ? 1 : 0);
                        offset += BOOL_BYTE;
                        dataView.setInt8(offset, item.SimSkill5 ? 1 : 0);
                        offset += BOOL_BYTE;
                        dataView.setInt8(offset, item.SimSkill6 ? 1 : 0);
                        offset += BOOL_BYTE;
                        dataView.setInt8(offset, item.SimSkill7 ? 1 : 0);
                        offset += BOOL_BYTE;
                        dataView.setInt8(offset, item.SimSkill8 ? 1 : 0);
                        offset += BOOL_BYTE;
                        dataView.setInt8(offset, item.SimSkill9 ? 1 : 0);
                        offset += BOOL_BYTE;

                        dataView.setUint16(offset, item.SimSkill1Pow, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.SimSkill2Pow, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.SimSkill3Pow, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.SimSkill4Pow, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.SimSkill5Pow, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.SimSkill6Pow, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.SimSkill7Pow, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.SimSkill8Pow, true);
                        offset += INT_BYTE;
                        dataView.setUint16(offset, item.SimSkill9Pow, true);
                        offset += INT_BYTE;
                        //#endregion
                    }

                    const message = {
                        type: 'result',
                        data: {
                            arrayId: 'sim_unit_list',
                            length: numElements,
                            dataBuffer: arrayBuffer
                        }
                    };
                    self.postMessage(message, [arrayBuffer]);
                }

            }
        case 'cancel': 
            isCancelled = true;
            break;

        default:
            self.postMessage({ type: 'error', payload: `Received message with unhandled type: ${message.type}` });
            break;
    }
};

self.onerror = function (e) {
    self.postMessage({
        type: 'error',
        payload: e.message || 'Unknown worker error'
    });
};

async function checkGekihaGurume(check_index, all_numbers, used_numbers, check_power, setting) {
    if (check_index === setting.length) {
        return true;
    }
    const current_min = setting[check_index].Min;
    const current_max = setting[check_index].Max;

    for (let i = 0; i < all_numbers.length; i++) {
        if (!used_numbers[i] &&
            all_numbers[i] >= current_min &&
            all_numbers[i] <= current_max) {
            used_numbers[i] = true;
            check_power.push(all_numbers[i]);
            if (await checkGekihaGurume(check_index + 1, all_numbers, used_numbers, check_power, setting)) {
                return true;
            }
            used_numbers[i] = false;
            check_power.pop();
        }
    }
    return false;
}

async function testTorehan(result_list, list_limit) {
    result_list.sort((a, b) => b.SimSkill1Pow - a.SimSkill1Pow);
    let names = [];
    let name_list = [];
    for (const unit of result_list) {
        if (unit.Leader_Torehan > 0) {
            if (!names.includes(unit.Number)) {
                names.push(unit.Number);
                name_list.push([unit.Number, unit.TitlePrefix, unit.TitleSuffix]);
                if (name_list.length === 20) {
                    break;
                }
            }
        }
    }
    if (names.length === 0) {
        return null;
    }
    const temp_leaders = [];
    let count = 0;
    for (const unit of name_list) {
        count = 0;
        for (const uni of result_list) {
            if (uni.Number === unit[0]) {
                if (uni.TitlePrefix === unit[1] && uni.TitleSuffix === unit[2]) {
                    count++;
                    temp_leaders.push(uni);
                    if (count === 10) {
                        break;
                    }
                }
            }
        }
    }
    const leaders = temp_leaders.map(item => ({ ...item }));;
    result_list.sort((a, b) => (b.SimSkill1Pow - b.Leader_Torehan) - (a.SimSkill1Pow - a.Leader_Torehan));

    names = [];
    name_list = [];
    for (const unit of result_list) {
        if (!unit.Leader_Only) {
            if (!names.includes(unit.Number)) {
                names.push(unit.Number);
                name_list.push([unit.Number, unit.TitlePrefix, unit.TitleSuffix]);
                if (name_list.length === 30) {
                    break;
                }
            }
        }
    }
    if (names.length < 6) {
        return null;
    }
    let members = [];
    for (const unit of name_list) {
        count = 0;
        for (const uni of result_list) {
            if (!uni.Leader_Only) {
                if (uni.Number === unit[0]) {
                    if (uni.TitlePrefix === unit[1] && uni.TitleSuffix === unit[2]) {
                        count++;
                        uni.SimSkill1Pow -= uni.Leader_Torehan
                        members.push(uni);
                        if (count === 10) {
                            break;
                        }
                    }
                }
            }
        }
    }


    const limit_equip_list = [];
    const temp_limit = [];
    let highest_pow = 0;
    let temp_pow = 0;    
    let temp_members = [];



    for (const u1 of leaders) {
        for (const u2 of members) {
            if (u1.Number === u2.Number) continue;
            if (u2.Number < 200) { if (Math.abs(u2.Number - u1.Number) <= 2) { continue; } }
            //#region u2
            limit_equip_list[0] = u1.Limit_Equip1;
            limit_equip_list[1] = u1.Limit_Equip2;

            if (u2.Equip1Name === u1.Equip1Name || u2.Equip2Name === u1.Equip1Name) { limit_equip_list[0]--; }
            if (u2.Equip1Name === u1.Equip2Name || u2.Equip2Name === u1.Equip2Name) { limit_equip_list[1]--; }
            if (limit_equip_list.some(x => x < 1)) { continue; }
            temp_limit[0] = limit_equip_list[0];
            temp_limit[1] = limit_equip_list[1];

            //#endregion
            for (const u3 of members) {
                if (u3.Number === u1.Number || u3.Number === u2.Number) continue;
                if (u3.Number < 200) {
                    if (Math.abs(u3.Number - u1.Number) <= 2) {
                        continue;
                    }
                    if (Math.abs(u3.Number - u2.Number) <= 2) {
                        continue;
                    }
                }
                //#region u3
                limit_equip_list[2] = u2.Limit_Equip1;
                limit_equip_list[3] = u2.Limit_Equip2;

                if (u3.Equip1Name === u1.Equip1Name || u3.Equip2Name === u1.Equip1Name) { limit_equip_list[0]--; }
                if (u3.Equip1Name === u1.Equip2Name || u3.Equip2Name === u1.Equip2Name) { limit_equip_list[1]--; }
                if (u3.Equip1Name === u2.Equip1Name || u3.Equip2Name === u2.Equip1Name) { limit_equip_list[2]--; }
                if (u3.Equip1Name === u2.Equip2Name || u3.Equip2Name === u2.Equip2Name) { limit_equip_list[3]--; }
                if (limit_equip_list.some(x => x < 1)) {
                    limit_equip_list[0] = temp_limit[0];
                    limit_equip_list[1] = temp_limit[1];
                    continue;
                }
                temp_limit[0] = limit_equip_list[0];
                temp_limit[1] = limit_equip_list[1];
                temp_limit[2] = limit_equip_list[2];
                temp_limit[3] = limit_equip_list[3];
                //#endregion
                for (const u4 of members) {
                    if (u4.Number === u1.Number || u4.Number === u2.Number || u4.Number === u3.Number) continue;
                    if (u4.Number < 200) {
                        if (Math.abs(u4.Number - u1.Number) <= 2) {
                            continue;
                        }
                        if (Math.abs(u4.Number - u2.Number) <= 2) {
                            continue;
                        }
                        if (Math.abs(u4.Number - u3.Number) <= 2) {
                            continue;
                        }
                    }
                    //#region u4
                    limit_equip_list[4] = u3.Limit_Equip1;
                    limit_equip_list[5] = u3.Limit_Equip2;

                    if (u4.Equip1Name === u1.Equip1Name || u4.Equip2Name === u1.Equip1Name) { limit_equip_list[0]--; }
                    if (u4.Equip1Name === u1.Equip2Name || u4.Equip2Name === u1.Equip2Name) { limit_equip_list[1]--; }
                    if (u4.Equip1Name === u2.Equip1Name || u4.Equip2Name === u2.Equip1Name) { limit_equip_list[2]--; }
                    if (u4.Equip1Name === u2.Equip2Name || u4.Equip2Name === u2.Equip2Name) { limit_equip_list[3]--; }
                    if (u4.Equip1Name === u3.Equip1Name || u4.Equip2Name === u3.Equip1Name) { limit_equip_list[4]--; }
                    if (u4.Equip1Name === u3.Equip2Name || u4.Equip2Name === u3.Equip2Name) { limit_equip_list[5]--; }
                    if (limit_equip_list.some(x => x < 1)) {
                        limit_equip_list[0] = temp_limit[0];
                        limit_equip_list[1] = temp_limit[1];
                        limit_equip_list[2] = temp_limit[2];
                        limit_equip_list[3] = temp_limit[3];
                        continue;
                    }

                    //#endregion
                    temp_pow = u1.SimSkill1Pow + u2.SimSkill1Pow + u3.SimSkill1Pow + u4.SimSkill1Pow;
                    
                    if (temp_pow > highest_pow) {
                        highest_pow = temp_pow;
                        temp_members = [];
                        temp_members.push([u1, u2, u3, u4]);
                    }

                    if (temp_pow === highest_pow) {
                        highest_pow = temp_pow;
                        temp_members.push([u1, u2, u3, u4]);
                    }
                }
            }
        }
    }

    let temp_party = [];

    for (const pre of temp_members) {

        //#region
        limit_equip_list[0] = pre[0].Limit_Equip1;
        limit_equip_list[1] = pre[0].Limit_Equip2;
        limit_equip_list[2] = pre[1].Limit_Equip1;
        limit_equip_list[3] = pre[1].Limit_Equip2;
        limit_equip_list[4] = pre[2].Limit_Equip1;
        limit_equip_list[5] = pre[2].Limit_Equip2;

        if (pre[1].Equip1Name === pre[0].Equip1Name || pre[1].Equip2Name === pre[0].Equip1Name) { limit_equip_list[0]--; }
        if (pre[1].Equip1Name === pre[0].Equip2Name || pre[1].Equip2Name === pre[0].Equip2Name) { limit_equip_list[1]--; }

        if (pre[2].Equip1Name === pre[0].Equip1Name || pre[2].Equip2Name === pre[0].Equip1Name) { limit_equip_list[0]--; }
        if (pre[2].Equip1Name === pre[0].Equip2Name || pre[2].Equip2Name === pre[0].Equip2Name) { limit_equip_list[1]--; }
        if (pre[2].Equip1Name === pre[1].Equip1Name || pre[2].Equip2Name === pre[1].Equip1Name) { limit_equip_list[2]--; }
        if (pre[2].Equip1Name === pre[1].Equip2Name || pre[2].Equip2Name === pre[1].Equip2Name) { limit_equip_list[3]--; }

        if (pre[3].Equip1Name === pre[0].Equip1Name || pre[3].Equip2Name === pre[0].Equip1Name) { limit_equip_list[0]--; }
        if (pre[3].Equip1Name === pre[0].Equip2Name || pre[3].Equip2Name === pre[0].Equip2Name) { limit_equip_list[1]--; }
        if (pre[3].Equip1Name === pre[1].Equip1Name || pre[3].Equip2Name === pre[1].Equip1Name) { limit_equip_list[2]--; }
        if (pre[3].Equip1Name === pre[1].Equip2Name || pre[3].Equip2Name === pre[1].Equip2Name) { limit_equip_list[3]--; }
        if (pre[3].Equip1Name === pre[2].Equip1Name || pre[3].Equip2Name === pre[2].Equip1Name) { limit_equip_list[4]--; }
        if (pre[3].Equip1Name === pre[2].Equip2Name || pre[3].Equip2Name === pre[2].Equip2Name) { limit_equip_list[5]--; }

        temp_limit[0] = limit_equip_list[0];
        temp_limit[1] = limit_equip_list[1];
        temp_limit[2] = limit_equip_list[2];
        temp_limit[3] = limit_equip_list[3];
        temp_limit[4] = limit_equip_list[4];
        temp_limit[5] = limit_equip_list[5];
        //#endregion

        for (const u5 of members) {
            if (u5.Number === pre[0].Number || u5.Number === pre[1].Number || u5.Number === pre[2].Number || u5.Number === pre[3].Number) { continue; }
            if (u5.Number < 200) {
                if (Math.abs(u5.Number - pre[0].Number) <= 2) {
                    continue;
                }
                if (Math.abs(u5.Number - pre[1].Number) <= 2) {
                    continue;
                }
                if (Math.abs(u5.Number - pre[2].Number) <= 2) {
                    continue;
                }
                if (Math.abs(u5.Number - pre[3].Number) <= 2) {
                    continue;
                }
            }
            //#region u5

            limit_equip_list[6] = pre[3].Limit_Equip1;
            limit_equip_list[7] = pre[3].Limit_Equip2;

            if (u5.Equip1Name === pre[0].Equip1Name || u5.Equip2Name === pre[0].Equip1Name) { limit_equip_list[0]--; }
            if (u5.Equip1Name === pre[0].Equip2Name || u5.Equip2Name === pre[0].Equip2Name) { limit_equip_list[1]--; }
            if (u5.Equip1Name === pre[1].Equip1Name || u5.Equip2Name === pre[1].Equip1Name) { limit_equip_list[2]--; }
            if (u5.Equip1Name === pre[1].Equip2Name || u5.Equip2Name === pre[1].Equip2Name) { limit_equip_list[3]--; }
            if (u5.Equip1Name === pre[2].Equip1Name || u5.Equip2Name === pre[2].Equip1Name) { limit_equip_list[4]--; }
            if (u5.Equip1Name === pre[2].Equip2Name || u5.Equip2Name === pre[2].Equip2Name) { limit_equip_list[5]--; }
            if (u5.Equip1Name === pre[3].Equip1Name || u5.Equip2Name === pre[3].Equip1Name) { limit_equip_list[6]--; }
            if (u5.Equip1Name === pre[3].Equip2Name || u5.Equip2Name === pre[3].Equip2Name) { limit_equip_list[7]--; }

            if (limit_equip_list.some(x => x < 1)) {
                limit_equip_list[0] = temp_limit[0];
                limit_equip_list[1] = temp_limit[1];
                limit_equip_list[2] = temp_limit[2];
                limit_equip_list[3] = temp_limit[3];
                limit_equip_list[4] = temp_limit[4];
                limit_equip_list[5] = temp_limit[5];
                continue;
            }
            temp_limit[0] = limit_equip_list[0];
            temp_limit[1] = limit_equip_list[1];
            temp_limit[2] = limit_equip_list[2];
            temp_limit[3] = limit_equip_list[3];
            temp_limit[4] = limit_equip_list[4];
            temp_limit[5] = limit_equip_list[5];
            temp_limit[6] = limit_equip_list[6];
            temp_limit[7] = limit_equip_list[7];
            //#endregion
            for (const u6 of members) {
                if (u6.Number === pre[0].Number || u6.Number === pre[1].Number || u6.Number === pre[2].Number ||
                    u6.Number === pre[3].Number || u6.Number === u5.Number) { continue; }
                if (u6.Number < 200) {
                    if (Math.abs(u6.Number - pre[0].Number) <= 2) {
                        continue;
                    }
                    if (Math.abs(u6.Number - pre[1].Number) <= 2) {
                        continue;
                    }
                    if (Math.abs(u6.Number - pre[2].Number) <= 2) {
                        continue;
                    }
                    if (Math.abs(u6.Number - pre[3].Number) <= 2) {
                        continue;
                    }
                    if (Math.abs(u6.Number - u5.Number) <= 2) {
                        continue;
                    }
                }
                //#region u6
                limit_equip_list[8] = u5.Limit_Equip1;
                limit_equip_list[9] = u5.Limit_Equip2;

                if (u6.Equip1Name === pre[0].Equip1Name || u6.Equip2Name === pre[0].Equip1Name) { limit_equip_list[0]--; }
                if (u6.Equip1Name === pre[0].Equip2Name || u6.Equip2Name === pre[0].Equip2Name) { limit_equip_list[1]--; }
                if (u6.Equip1Name === pre[1].Equip1Name || u6.Equip2Name === pre[1].Equip1Name) { limit_equip_list[2]--; }
                if (u6.Equip1Name === pre[1].Equip2Name || u6.Equip2Name === pre[1].Equip2Name) { limit_equip_list[3]--; }
                if (u6.Equip1Name === pre[2].Equip1Name || u6.Equip2Name === pre[2].Equip1Name) { limit_equip_list[4]--; }
                if (u6.Equip1Name === pre[2].Equip2Name || u6.Equip2Name === pre[2].Equip2Name) { limit_equip_list[5]--; }
                if (u6.Equip1Name === pre[3].Equip1Name || u6.Equip2Name === pre[3].Equip1Name) { limit_equip_list[6]--; }
                if (u6.Equip1Name === pre[3].Equip2Name || u6.Equip2Name === pre[3].Equip2Name) { limit_equip_list[7]--; }
                if (u6.Equip1Name === u5.Equip1Name || u6.Equip2Name === u5.Equip1Name) { limit_equip_list[8]--; }
                if (u6.Equip1Name === u5.Equip2Name || u6.Equip2Name === u5.Equip2Name) { limit_equip_list[9]--; }

                if (limit_equip_list.some(x => x < 1)) {
                    limit_equip_list[0] = temp_limit[0];
                    limit_equip_list[1] = temp_limit[1];
                    limit_equip_list[2] = temp_limit[2];
                    limit_equip_list[3] = temp_limit[3];
                    limit_equip_list[4] = temp_limit[4];
                    limit_equip_list[5] = temp_limit[5];
                    limit_equip_list[6] = temp_limit[6];
                    limit_equip_list[7] = temp_limit[7];
                    continue;
                }
                //#endregion

                temp_pow = pre[0].SimSkill1Pow + pre[1].SimSkill1Pow +
                    pre[2].SimSkill1Pow + pre[3].SimSkill1Pow +
                    u5.SimSkill1Pow + u6.SimSkill1Pow;
                if (temp_pow > highest_pow) {
                    highest_pow = temp_pow;
                    temp_party = [];
                    temp_party.push([pre[0], pre[1], pre[2], pre[3], u5, u6]);
                }
                else if (temp_pow === highest_pow) {
                    highest_pow = temp_pow;
                    temp_party.push([pre[0], pre[1], pre[2], pre[3], u5, u6]);
                }

            }
        }
    }

    if (temp_party.length === 0) {
        return null;
    }
    let result = [];

    const checked_list_map = new Map();
    for (const item of temp_party) {
        const leaderKeyPart = `${item[0].Number},${item[0].Equip1Name},${item[0].Equip2Name}`;
        const subMembers = item.slice(1).sort((a, b) => {
            if (a.SimSkill1Pow !== b.SimSkill1Pow) {
                return b.SimSkill1Pow - a.SimSkill1Pow;
            }
            return a.Number - b.Number;
        });
        const sortedSubMemberKeys = [];
        for (const member of subMembers) {
            sortedSubMemberKeys.push(`${member.Number},${member.Equip1Name},${member.Equip2Name}`);
        }
        const finalKey = `${leaderKeyPart}|${sortedSubMemberKeys.join(',')}`;
        if (!checked_list_map.has(finalKey)) {
            checked_list_map.set(finalKey, item);
        }
    }
    result = Array.from(checked_list_map.values());


    return result;
}
