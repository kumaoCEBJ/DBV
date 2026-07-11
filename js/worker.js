self.onmessage = function (e) {
    const { action, payload } = e.data;
    if (action === 'undefined') {
        self.postMessage({ action: 'error' });
    }
    else if (action === "Simulate") {
        setTimeout(async () => {
            await startSimulate(payload);
        }, 0);
    }
};
async function startSimulate(data) {
    const inputData = JSON.parse(data);
    const debug = true;




    //#region
    const is_unique = inputData.Is_Sim_Unique;
    const is_common = inputData.Is_Sim_Common;
    const list_limit = inputData.List_Limit;

    const has_gekiha = inputData.Has_Gekiha;
    const setting_gekiha_min = new Uint16Array(inputData.Gekiha_Setting_Min);
    const setting_gekiha_max = new Uint16Array(inputData.Gekiha_Setting_Max);
    const gekiha_min = inputData.Gekiha_Min;
    const gekiha_max = inputData.Gekiha_Max;
    const setting_gekiha_count = setting_gekiha_min.length;
    const result_gekiha = new Uint16Array(setting_gekiha_count);
    const gekiha_reject = inputData.Gekiha_Reject;

    const has_gurume = inputData.Has_Gurume;
    const setting_gurume_min = new Uint16Array(inputData.Gurume_Setting_Min);
    const setting_gurume_max = new Uint16Array(inputData.Gurume_Setting_Max);
    const gurume_min = inputData.Gurume_Min;
    const gurume_max = inputData.Gurume_Max;
    const setting_gurume_count = setting_gurume_min.length;
    const result_gurume = new Uint16Array(setting_gurume_count);
    const gurume_reject = inputData.Gurume_Reject;

    const can_or = inputData.Can_Or;
    const filter_kago = inputData.Filter_Kago;
    const filter_kago_or = inputData.Filter_Kago_Or;
    const filter_slay = inputData.Filter_Slay;
    const filter_slay_or = inputData.Filter_Slay_Or;
    const can_torehan = inputData.Can_Torehan;
    const torehan_current = new Uint32Array(inputData.Torehan_Current);
    let leader_only = false;
    //#endregion
    //#region
    const setting_name = new Uint16Array(inputData.Sim_Setting.map(item => item.Name));
    const setting_mode = new Uint16Array(inputData.Sim_Setting.map(item => item.Mode));
    const setting_min = new Uint16Array(inputData.Sim_Setting.map(item => item.MinPow));
    const setting_max = new Uint16Array(inputData.Sim_Setting.map(item => item.MaxPow));
    //#endregion
    //#region
    const equip_number = new Uint16Array(inputData.Sim_Equip.map(item => item.Number));
    const equip_type = new Uint16Array(inputData.Sim_Equip.map(item => item.Type));
    const equip_rank = new Uint16Array(inputData.Sim_Equip.map(item => item.Rank));
    const equip_slay1 = new Uint32Array(inputData.Sim_Equip.map(item => item.EquipSlay1));
    const equip_slay2 = new Uint32Array(inputData.Sim_Equip.map(item => item.EquipSlay2));
    const equip_gekiha1 = new Uint16Array(inputData.Sim_Equip.map(item => item.Gekiha1));
    const equip_gekiha2 = new Uint16Array(inputData.Sim_Equip.map(item => item.Gekiha2));
    const equip_gurume1 = new Uint16Array(inputData.Sim_Equip.map(item => item.Gurume1));
    const equip_gurume2 = new Uint16Array(inputData.Sim_Equip.map(item => item.Gurume2));
    const equip_p1 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Pow1));
    const equip_p2 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Pow2));
    const equip_p3 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Pow3));
    const equip_p4 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Pow4));
    const equip_p5 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Pow5));
    const equip_p6 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Pow6));
    const equip_p7 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Pow7));
    const equip_p8 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Pow8));
    const equip_p9 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Pow9));
    const equip_c1 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Count1));
    const equip_c2 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Count2));
    const equip_c3 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Count3));
    const equip_c4 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Count4));
    const equip_c5 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Count5));
    const equip_c6 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Count6));
    const equip_c7 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Count7));
    const equip_c8 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Count8));
    const equip_c9 = new Uint16Array(inputData.Sim_Equip.map(item => item.Skill_Count9));
    const e_count = equip_number.length;
    let itemBuckets = Array.from({ length: 14 }, () => []);
    for (let i = 0; i < e_count; i++) {
        const typeFlag = equip_type[i];
        for (let bit = 0; bit < 14; bit++) {
            if ((typeFlag & (1 << bit)) !== 0) {
                itemBuckets[bit].push(i);
            }
        }
    }
    itemBuckets = itemBuckets.map(item => new Uint32Array(item));
    //#endregion
    let counter = 0;
    const result_unit_list = [];
    const property_count = 6 + 9 + 9;
    const totalelements = (list_limit + 1) * property_count;
    let list_count = 0;
    const u16 = new Uint16Array(totalelements);
    let idx = 0;

    if (can_torehan) {
        if (is_unique === 1) {
            //#region
            const unique_number = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Number));
            const unique_kago1 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Kago1));
            const unique_kago2 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Kago2));
            const unique_slay = new Uint32Array(inputData.Sim_Unit_U.map(item => item.Slay));
            const unique_equip1 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.CategoryEquip1));
            const unique_equip2 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.CategoryEquip2));            

            const unique_leader_torehan = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Leader_Torehan));
            const unique_p1 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow1));
            const unique_p2 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow2));
            const unique_p3 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow3));
            const unique_p4 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow4));
            const unique_p5 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow5));
            const unique_p6 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow6));
            const unique_p7 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow7));
            const unique_p8 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow8));
            const unique_p9 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow9));
            const unique_c1 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count1));
            const unique_c2 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count2));
            const unique_c3 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count3));
            const unique_c4 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count4));
            const unique_c5 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count5));
            const unique_c6 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count6));
            const unique_c7 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count7));
            const unique_c8 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count8));
            const unique_c9 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count9));
            //#endregion
            const gekiha_u_count = new Uint16Array(inputData.Gekiha_Count_U);
            const gekiha_u_offset = new Uint16Array(inputData.Gekiha_Offset_U);
            const gekiha_u_values = new Uint16Array(inputData.Gekiha_Values_U);

            const gurume_u_count = new Uint16Array(inputData.Gurume_Count_U);
            const gurume_u_offset = new Uint16Array(inputData.Gurume_Offset_U);
            const gurume_u_values = new Uint16Array(inputData.Gurume_Values_U);

            //#region
            const title_u_number = new Uint16Array(inputData.Sim_Title_U.map(item => item.Number));
            const title_u_namenumber = new Uint16Array(inputData.Sim_Title_U.map(item => item.NameForTitle));
            const title_u_kago1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.TitleKago1));
            const title_u_kago2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.TitleKago2));
            const title_u_slay1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.TitleSlay1));
            const title_u_slay2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.TitleSlay2));
            const title_u_gekiha1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Gekiha1));
            const title_u_gekiha2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Gekiha2));

            const title_u_gurume1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Gurume1));
            const title_u_gurume2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Gurume2));

            const title_u_p1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow1));
            const title_u_p2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow2));
            const title_u_p3 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow3));
            const title_u_p4 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow4));
            const title_u_p5 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow5));
            const title_u_p6 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow6));
            const title_u_p7 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow7));
            const title_u_p8 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow8));
            const title_u_p9 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow9));
            const title_u_c1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count1));
            const title_u_c2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count2));
            const title_u_c3 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count3));
            const title_u_c4 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count4));
            const title_u_c5 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count5));
            const title_u_c6 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count6));
            const title_u_c7 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count7));
            const title_u_c8 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count8));
            const title_u_c9 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count9));
            const t_count_unique = title_u_number.length;
            const t_match = new Uint32Array(t_count_unique);
            //#endregion
            const u_count = unique_number.length;            
            let gg_unit = [];
            if (gekiha_reject > 0) {
                let gg_and = 0;
                for (let ss = 0; ss < 9; ss++) {
                    if (setting_name[ss] === 2) {
                        if (setting_mode[ss] === 1) {
                            gg_and = 1;
                            break;
                        }
                    }
                }
                if (gg_and === 0) {
                    for (let gg = 0; gg < u_count; gg++) {
                        if (gekiha_u_count[gg] > 0) {
                            gg_unit.push(gg);
                        }
                    }
                }
            }
            if (gurume_reject > 0) {
                let gg_and = 0;
                for (let ss = 0; ss < 9; ss++) {
                    if (setting_name[ss] === 3) {
                        if (setting_mode[ss] === 1) {
                            gg_and = 1;
                            break;
                        }
                    }
                }
                if (gg_and === 0) {
                    for (let gg = 0; gg < u_count; gg++) {
                        if (gurume_u_count[gg] > 0) {
                            gg_unit.push(gg);
                        }
                    }
                }
            }

            for (let u = 0; u < u_count; u++) {
                await new Promise(resolve => setTimeout(resolve, 1));
                counter++;
                self.postMessage({ action: "progress", payload: counter });
                //#region
                if (setting_mode[0] === 4 && (unique_c1[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[1] === 4 && (unique_c2[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[2] === 4 && (unique_c3[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[3] === 4 && (unique_c4[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[4] === 4 && (unique_c5[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[5] === 4 && (unique_c6[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[6] === 4 && (unique_c7[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[7] === 4 && (unique_c8[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[8] === 4 && (unique_c9[u] === 1 || gg_unit.includes(u))) continue;
                //#endregion
                //#region
                let t_count = 1;
                t_match[0] = 0;
                for (var t = 1; t < t_count_unique; t++) {
                    if (unique_number[u] !== title_u_namenumber[t]) continue;
                    t_match[t_count++] = t;
                }
                //#endregion
                //#region
                const e_type1 = unique_equip1[u];
                const e_type2 = unique_equip2[u];
                for (let bit1 = 0; bit1 < 13; bit1++) {
                    if ((e_type1 & (1 << bit1)) === 0) continue;
                    const e_match1 = itemBuckets[bit1];
                    for (let bit2 = 0; bit2 < 13; bit2++) {
                        if ((e_type2 & (1 << bit2)) === 0) continue;
                        const e_match2 = itemBuckets[bit2];
                        //#endregion
                        for (let t1 = 0; t1 < t_count; t1++) {
                            const t1_index = t_match[t1];
                            //#region
                            const t1_pow1 = unique_p1[u] + title_u_p1[t1_index];
                            const t1_pow2 = unique_p2[u] + title_u_p2[t1_index];
                            const t1_pow3 = unique_p3[u] + title_u_p3[t1_index];
                            const t1_pow4 = unique_p4[u] + title_u_p4[t1_index];
                            const t1_pow5 = unique_p5[u] + title_u_p5[t1_index];
                            const t1_pow6 = unique_p6[u] + title_u_p6[t1_index];
                            const t1_pow7 = unique_p7[u] + title_u_p7[t1_index];
                            const t1_pow8 = unique_p8[u] + title_u_p8[t1_index];
                            const t1_pow9 = unique_p9[u] + title_u_p9[t1_index];
                            const t1_count1 = unique_c1[u] + title_u_c1[t1_index];
                            const t1_count2 = unique_c2[u] + title_u_c2[t1_index];
                            const t1_count3 = unique_c3[u] + title_u_c3[t1_index];
                            const t1_count4 = unique_c4[u] + title_u_c4[t1_index];
                            const t1_count5 = unique_c5[u] + title_u_c5[t1_index];
                            const t1_count6 = unique_c6[u] + title_u_c6[t1_index];
                            const t1_count7 = unique_c7[u] + title_u_c7[t1_index];
                            const t1_count8 = unique_c8[u] + title_u_c8[t1_index];
                            const t1_count9 = unique_c9[u] + title_u_c9[t1_index];
                            //#endregion
                            //#region
                            if (t1_pow1 === 0 && t1_count1 > 1) continue;
                            if (t1_pow2 === 0 && t1_count2 > 1) continue;
                            if (t1_pow3 === 0 && t1_count3 > 1) continue;
                            if (t1_pow4 === 0 && t1_count4 > 1) continue;
                            if (t1_pow5 === 0 && t1_count5 > 1) continue;
                            if (t1_pow6 === 0 && t1_count6 > 1) continue;
                            if (t1_pow7 === 0 && t1_count7 > 1) continue;
                            if (t1_pow8 === 0 && t1_count8 > 1) continue;
                            if (t1_pow9 === 0 && t1_count9 > 1) continue;
                            //#endregion
                            //#region
                            if (filter_kago > 0) {
                                let bit_kago = 0;
                                if (title_u_kago1[t1_index] > 0) {
                                    bit_kago |= title_u_kago1[t1_index];
                                }
                                else {
                                    bit_kago |= unique_kago1[u];
                                }
                                if (title_u_kago2[t1_index] > 0) {
                                    bit_kago |= title_u_kago2[t1_index];
                                }
                                else {
                                    if (unique_kago2[u] > 0) {
                                        bit_kago |= unique_kago2[u];
                                    }
                                }
                                if (filter_kago_or === 1) {
                                    if ((bit_kago & filter_kago) === 0) continue;
                                }
                                else {
                                    if ((bit_kago & filter_kago) !== filter_kago) continue;
                                }
                            }
                            //#endregion
                            for (let e1 = 0; e1 < e_match1.length; e1++) {
                                const e1_index = e_match1[e1];
                                //#region
                                const e1_pow1 = t1_pow1 + equip_p1[e1_index];
                                const e1_pow2 = t1_pow2 + equip_p2[e1_index];
                                const e1_pow3 = t1_pow3 + equip_p3[e1_index];
                                const e1_pow4 = t1_pow4 + equip_p4[e1_index];
                                const e1_pow5 = t1_pow5 + equip_p5[e1_index];
                                const e1_pow6 = t1_pow6 + equip_p6[e1_index];
                                const e1_pow7 = t1_pow7 + equip_p7[e1_index];
                                const e1_pow8 = t1_pow8 + equip_p8[e1_index];
                                const e1_pow9 = t1_pow9 + equip_p9[e1_index];
                                const e1_count1 = t1_count1 + equip_c1[e1_index];
                                const e1_count2 = t1_count2 + equip_c2[e1_index];
                                const e1_count3 = t1_count3 + equip_c3[e1_index];
                                const e1_count4 = t1_count4 + equip_c4[e1_index];
                                const e1_count5 = t1_count5 + equip_c5[e1_index];
                                const e1_count6 = t1_count6 + equip_c6[e1_index];
                                const e1_count7 = t1_count7 + equip_c7[e1_index];
                                const e1_count8 = t1_count8 + equip_c8[e1_index];
                                const e1_count9 = t1_count9 + equip_c9[e1_index];
                                //#endregion
                                for (let e2 = 0; e2 < e_match2.length; e2++) {
                                    const e2_index = e_match2[e2];
                                    //#region
                                    if (filter_slay > 0) {
                                        let bit_slay = unique_slay[u] | title_u_slay1[t1_index] | title_u_slay2[t1_index] |
                                            equip_slay1[e1_index] | equip_slay2[e1_index] | equip_slay1[e2_index] | equip_slay2[e2_index];
                                        if (filter_slay_or === 1) {
                                            if ((bit_slay & filter_slay) === 0) continue;
                                        }
                                        else {
                                            if (filter_slay === 4194304) {
                                                if (bit_slay !== 4194304) continue;
                                            }
                                            else if ((bit_slay & filter_slay) !== filter_slay) continue;
                                        }
                                    }
                                    //#endregion

                                    //#region
                                    let skillcheck = 0;
                                    let e2_pow1 = e1_pow1 + equip_p1[e2_index];
                                    let e2_pow2 = e1_pow2 + equip_p2[e2_index];
                                    let e2_pow3 = e1_pow3 + equip_p3[e2_index];
                                    let e2_pow4 = e1_pow4 + equip_p4[e2_index];
                                    let e2_pow5 = e1_pow5 + equip_p5[e2_index];
                                    let e2_pow6 = e1_pow6 + equip_p6[e2_index];
                                    let e2_pow7 = e1_pow7 + equip_p7[e2_index];
                                    let e2_pow8 = e1_pow8 + equip_p8[e2_index];
                                    let e2_pow9 = e1_pow9 + equip_p9[e2_index];
                                    let e2_count1 = e1_count1 + equip_c1[e2_index];
                                    let e2_count2 = e1_count2 + equip_c2[e2_index];
                                    let e2_count3 = e1_count3 + equip_c3[e2_index];
                                    let e2_count4 = e1_count4 + equip_c4[e2_index];
                                    let e2_count5 = e1_count5 + equip_c5[e2_index];
                                    let e2_count6 = e1_count6 + equip_c6[e2_index];
                                    let e2_count7 = e1_count7 + equip_c7[e2_index];
                                    let e2_count8 = e1_count8 + equip_c8[e2_index];
                                    let e2_count9 = e1_count9 + equip_c9[e2_index];
                                    //#endregion
                                    if (has_gekiha === 1) {
                                        const _g_count = gekiha_u_count[u];
                                        const _g_offset = gekiha_u_offset[u];
                                        let has_gekiha_count = 0;
                                        if (title_u_gekiha1[t1_index] > 0) has_gekiha_count++;
                                        if (title_u_gekiha2[t1_index] > 0) has_gekiha_count++;
                                        if (equip_gekiha1[e1_index] > 0) has_gekiha_count++;
                                        if (equip_gekiha2[e1_index] > 0) has_gekiha_count++;
                                        if (equip_gekiha1[e2_index] > 0) has_gekiha_count++;
                                        if (equip_gekiha2[e2_index] > 0) has_gekiha_count++;
                                        const total_count_g = _g_count + has_gekiha_count;
                                        if (total_count_g === 0 || total_count_g < setting_gekiha_count) continue;

                                        const has_power_g = new Uint16Array(total_count_g);
                                        for (let g = 0; g < _g_count; g++) {
                                            has_power_g[g] = gekiha_u_values[g + _g_offset];
                                        }
                                        has_gekiha_count = 0;
                                        if (title_u_gekiha1[t1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = title_u_gekiha1[t1_index];
                                        if (title_u_gekiha2[t1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = title_u_gekiha2[t1_index];
                                        if (equip_gekiha1[e1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha1[e1_index];
                                        if (equip_gekiha2[e1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha2[e1_index];
                                        if (equip_gekiha1[e2_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha1[e2_index];
                                        if (equip_gekiha2[e2_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha2[e2_index];
                                        let simple_count = 0;
                                        for (let g = 0; g < total_count_g; g++) {
                                            if (has_power_g[g] >= gekiha_min && has_power_g[g] <= gekiha_max) simple_count++;
                                        }
                                        if (setting_gekiha_count > simple_count) continue;
                                        const loop_indices = new Int16Array(setting_gekiha_count).fill(0);
                                        const selected_indices = new Int16Array(setting_gekiha_count).fill(-1);
                                        const used = new Uint8Array(total_count_g).fill(0);

                                        let current_depth = 0;
                                        let gekiha_check = 0;
                                        while (current_depth >= 0) {
                                            if (current_depth === setting_gekiha_count) {
                                                gekiha_check = 1;
                                                break;
                                            }
                                            const Min = setting_gekiha_min[current_depth];
                                            const Max = setting_gekiha_max[current_depth];
                                            let found = false;
                                            for (let i = loop_indices[current_depth]; i < total_count_g; i++) {
                                                if (used[i] === 0) {
                                                    const val = has_power_g[i];
                                                    if (val >= Min && val <= Max) {
                                                        used[i] = 1;
                                                        selected_indices[current_depth] = i;
                                                        loop_indices[current_depth] = i + 1;
                                                        found = true;
                                                        break;
                                                    }
                                                }
                                            }

                                            if (found) {
                                                current_depth++;
                                            } else {
                                                loop_indices[current_depth] = 0;
                                                current_depth--;
                                                if (current_depth >= 0) {
                                                    const prev_idx = selected_indices[current_depth];
                                                    used[prev_idx] = 0;
                                                }
                                            }
                                        }
                                        if (gekiha_check === 0) continue;
                                        let selected_g_index = 0;
                                        let selected_g_count = 0;
                                        if (setting_name[0] === 2 && setting_mode[0] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow1 = has_power_g[selected_g_index];
                                            e2_count1 = 1;
                                        }
                                        if (setting_name[1] === 2 && setting_mode[1] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow2 = has_power_g[selected_g_index];
                                            e2_count2 = 1;
                                        }
                                        if (setting_name[2] === 2 && setting_mode[2] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow3 = has_power_g[selected_g_index];
                                            e2_count3 = 1;
                                        }
                                        if (setting_name[3] === 2 && setting_mode[3] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow4 = has_power_g[selected_g_index];
                                            e2_count4 = 1;
                                        }
                                        if (setting_name[4] === 2 && setting_mode[4] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow5 = has_power_g[selected_g_index];
                                            e2_count5 = 1;
                                        }
                                        if (setting_name[5] === 2 && setting_mode[5] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow6 = has_power_g[selected_g_index];
                                            e2_count6 = 1;
                                        }
                                        if (setting_name[6] === 2 && setting_mode[6] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow7 = has_power_g[selected_g_index];
                                            e2_count7 = 1;
                                        }
                                        if (setting_name[7] === 2 && setting_mode[7] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow8 = has_power_g[selected_g_index];
                                            e2_count8 = 1;
                                        }
                                        if (setting_name[8] === 2 && setting_mode[8] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow9 = has_power_g[selected_g_index];
                                            e2_count9 = 1;
                                        }
                                    }

                                    if (has_gurume === 1) {
                                        const _g_count = gurume_u_count[u];
                                        const _g_offset = gurume_u_offset[u];
                                        let has_gurume_count = 0;

                                        if (title_u_gurume1[t1_index] > 0) has_gurume_count++;
                                        if (title_u_gurume2[t1_index] > 0) has_gurume_count++;
                                        if (equip_gurume1[e1_index] > 0) has_gurume_count++;
                                        if (equip_gurume2[e1_index] > 0) has_gurume_count++;
                                        if (equip_gurume1[e2_index] > 0) has_gurume_count++;
                                        if (equip_gurume2[e2_index] > 0) has_gurume_count++;

                                        const total_count_g = _g_count + has_gurume_count;
                                        if (total_count_g === 0 || total_count_g < setting_gurume_count) continue;

                                        const has_power_g = new Uint16Array(total_count_g);
                                        for (let g = 0; g < _g_count; g++) {
                                            has_power_g[g] = gurume_u_values[g + _g_offset];
                                        }
                                        has_gurume_count = 0;
                                        if (title_u_gurume1[t1_index] > 0) has_power_g[_g_count + has_gurume_count++] = title_u_gurume1[t1_index];
                                        if (title_u_gurume2[t1_index] > 0) has_power_g[_g_count + has_gurume_count++] = title_u_gurume2[t1_index];
                                        if (equip_gurume1[e1_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume1[e1_index];
                                        if (equip_gurume2[e1_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume2[e1_index];
                                        if (equip_gurume1[e2_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume1[e2_index];
                                        if (equip_gurume2[e2_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume2[e2_index];

                                        let simple_count = 0;
                                        for (let g = 0; g < total_count_g; g++) {
                                            if (has_power_g[g] >= gurume_min && has_power_g[g] <= gurume_max) simple_count++;
                                        }
                                        if (setting_gurume_count > simple_count) continue;
                                        const loop_indices = new Int16Array(setting_gurume_count).fill(0);
                                        const selected_indices = new Int16Array(setting_gurume_count).fill(-1);
                                        const used = new Uint8Array(total_count_g).fill(0);

                                        let current_depth = 0;
                                        let gurume_check = 0;
                                        while (current_depth >= 0) {
                                            if (current_depth === setting_gurume_count) {
                                                gurume_check = 1;
                                                break;
                                            }
                                            const Min = setting_gurume_min[current_depth];
                                            const Max = setting_gurume_max[current_depth];
                                            let found = false;
                                            for (let i = loop_indices[current_depth]; i < total_count_g; i++) {
                                                if (used[i] === 0) {
                                                    const val = has_power_g[i];
                                                    if (val >= Min && val <= Max) {
                                                        used[i] = 1;
                                                        selected_indices[current_depth] = i;
                                                        loop_indices[current_depth] = i + 1;
                                                        found = true;
                                                        break;
                                                    }
                                                }
                                            }

                                            if (found) {
                                                current_depth++;
                                            } else {
                                                loop_indices[current_depth] = 0;
                                                current_depth--;
                                                if (current_depth >= 0) {
                                                    const prev_idx = selected_indices[current_depth];
                                                    used[prev_idx] = 0;
                                                }
                                            }
                                        }
                                        if (gurume_check === 0) continue;
                                        let selected_g_index = 0;
                                        let selected_g_count = 0;
                                        if (setting_name[0] === 3 && setting_mode[0] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow1 = has_power_g[selected_g_index];
                                            e2_count1 = 1;
                                        }
                                        if (setting_name[1] === 3 && setting_mode[1] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow2 = has_power_g[selected_g_index];
                                            e2_count2 = 1;
                                        }
                                        if (setting_name[2] === 3 && setting_mode[2] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow3 = has_power_g[selected_g_index];
                                            e2_count3 = 1;
                                        }
                                        if (setting_name[3] === 3 && setting_mode[3] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow4 = has_power_g[selected_g_index];
                                            e2_count4 = 1;
                                        }
                                        if (setting_name[4] === 3 && setting_mode[4] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow5 = has_power_g[selected_g_index];
                                            e2_count5 = 1;
                                        }
                                        if (setting_name[5] === 3 && setting_mode[5] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow6 = has_power_g[selected_g_index];
                                            e2_count6 = 1;
                                        }
                                        if (setting_name[6] === 3 && setting_mode[6] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow7 = has_power_g[selected_g_index];
                                            e2_count7 = 1;
                                        }
                                        if (setting_name[7] === 3 && setting_mode[7] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow8 = has_power_g[selected_g_index];
                                            e2_count8 = 1;
                                        }
                                        if (setting_name[8] === 3 && setting_mode[8] === 1) {
                                            selected_g_index = selected_indices[selected_g_count++];
                                            e2_pow9 = has_power_g[selected_g_index];
                                            e2_count9 = 1;
                                        }
                                    }
                                    //#region
                                    if (setting_mode[0] === 1) {
                                        skillcheck = 0;
                                        if (e2_count1 === 0) continue;
                                        if (e2_pow1 === 0) { }
                                        else if (e2_pow1 < setting_min[0] || setting_max[0] < e2_pow1) continue;
                                        skillcheck = 1;
                                    }
                                    if (setting_mode[1] === 1) {
                                        skillcheck = 0;
                                        if (e2_count2 === 0) continue;
                                        if (e2_pow2 === 0) { }
                                        else if (e2_pow2 < setting_min[1] || setting_max[1] < e2_pow2) continue;
                                        skillcheck = 1;
                                    }
                                    if (setting_mode[2] === 1) {
                                        skillcheck = 0;
                                        if (e2_count3 === 0) continue;
                                        if (e2_pow3 === 0) { }
                                        else if (e2_pow3 < setting_min[2] || setting_max[2] < e2_pow3) continue;
                                        skillcheck = 1;
                                    }
                                    if (setting_mode[3] === 1) {
                                        skillcheck = 0;
                                        if (e2_count4 === 0) continue;
                                        if (e2_pow4 === 0) { }
                                        else if (e2_pow4 < setting_min[3] || setting_max[3] < e2_pow4) continue;
                                        skillcheck = 1;
                                    }
                                    if (setting_mode[4] === 1) {
                                        skillcheck = 0;
                                        if (e2_count5 === 0) continue;
                                        if (e2_pow5 === 0) { }
                                        else if (e2_pow5 < setting_min[4] || setting_max[4] < e2_pow5) continue;
                                        skillcheck = 1;
                                    }
                                    if (setting_mode[5] === 1) {
                                        skillcheck = 0;
                                        if (e2_count6 === 0) continue;
                                        if (e2_pow6 === 0) { }
                                        else if (e2_pow6 < setting_min[5] || setting_max[5] < e2_pow6) continue;
                                        skillcheck = 1;
                                    }
                                    if (setting_mode[6] === 1) {
                                        skillcheck = 0;
                                        if (e2_count7 === 0) continue;
                                        if (e2_pow7 === 0) { }
                                        else if (e2_pow7 < setting_min[6] || setting_max[6] < e2_pow7) continue;
                                        skillcheck = 1;
                                    }
                                    if (setting_mode[7] === 1) {
                                        skillcheck = 0;
                                        if (e2_count8 === 0) continue;
                                        if (e2_pow8 === 0) { }
                                        else if (e2_pow8 < setting_min[7] || setting_max[7] < e2_pow8) continue;
                                        skillcheck = 1;
                                    }
                                    if (setting_mode[8] === 1) {
                                        skillcheck = 0;
                                        if (e2_count9 === 0) continue;
                                        if (e2_pow9 === 0) { }
                                        else if (e2_pow9 < setting_min[8] || setting_max[8] < e2_pow9) continue;
                                        skillcheck = 1;
                                    }
                                    if (skillcheck === 0) continue;
                                    //#endregion
                                    //#region
                                    if (can_or === 1) {
                                        skillcheck = 0;
                                        if (setting_mode[0] === 2 && setting_name[0] === 1) {
                                            if (e2_count1 > 0) {
                                                if (e2_pow1 === 0) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else if (e2_pow1 >= setting_min[0] && setting_max[0] >= e2_pow1) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else {
                                                    e2_count1 = 0;
                                                    e2_pow1 = 0;
                                                }
                                            }
                                        }
                                        if (setting_mode[1] === 2 && setting_name[1] === 1) {
                                            if (e2_count2 > 0) {
                                                if (e2_pow2 === 0) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else if (e2_pow2 >= setting_min[1] && setting_max[1] >= e2_pow2) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else {
                                                    e2_count2 = 0;
                                                    e2_pow2 = 0;
                                                }
                                            }
                                        }
                                        if (setting_mode[2] === 2 && setting_name[2] === 1) {
                                            if (e2_count3 > 0) {
                                                if (e2_pow3 === 0) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else if (e2_pow3 >= setting_min[2] && setting_max[2] >= e2_pow3) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else {
                                                    e2_count3 = 0;
                                                    e2_pow3 = 0;
                                                }
                                            }
                                        }
                                        if (setting_mode[3] === 2 && setting_name[3] === 1) {
                                            if (e2_count4 > 0) {
                                                if (e2_pow4 === 0) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else if (e2_pow4 >= setting_min[3] && setting_max[3] >= e2_pow4) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else {
                                                    e2_count4 = 0;
                                                    e2_pow4 = 0;
                                                }
                                            }
                                        }
                                        if (setting_mode[4] === 2 && setting_name[4] === 1) {
                                            if (e2_count5 > 0) {
                                                if (e2_pow5 === 0) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else if (e2_pow5 >= setting_min[4] && setting_max[4] >= e2_pow5) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else {
                                                    e2_count5 = 0;
                                                    e2_pow5 = 0;
                                                }
                                            }
                                        }
                                        if (setting_mode[5] === 2 && setting_name[5] === 1) {
                                            if (e2_count6 > 0) {
                                                if (e2_pow6 === 0) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else if (e2_pow6 >= setting_min[5] && setting_max[5] >= e2_pow6) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else {
                                                    e2_count6 = 0;
                                                    e2_pow6 = 0;
                                                }
                                            }
                                        }
                                        if (setting_mode[6] === 2 && setting_name[6] === 1) {
                                            if (e2_count7 > 0) {
                                                if (e2_pow7 === 0) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else if (e2_pow7 >= setting_min[6] && setting_max[6] >= e2_pow7) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else {
                                                    e2_count7 = 0;
                                                    e2_pow7 = 0;
                                                }
                                            }
                                        }
                                        if (setting_mode[7] === 2 && setting_name[7] === 1) {
                                            if (e2_count8 > 0) {
                                                if (e2_pow8 === 0) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else if (e2_pow8 >= setting_min[7] && setting_max[7] >= e2_pow8) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else {
                                                    e2_count8 = 0;
                                                    e2_pow8 = 0;
                                                }
                                            }
                                        }
                                        if (setting_mode[8] === 2 && setting_name[8] === 1) {
                                            if (e2_count9 > 0) {
                                                if (e2_pow9 === 0) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else if (e2_pow9 >= setting_min[8] && setting_max[8] >= e2_pow9) {
                                                    if (skillcheck === 1) continue;
                                                    else skillcheck = 1;
                                                }
                                                else {
                                                    e2_count9 = 0;
                                                    e2_pow9 = 0;
                                                }
                                            }
                                        }
                                        if (skillcheck === 0) continue;
                                    }
                                    //#endregion

                                    if ((e2_pow1 - unique_leader_torehan[u]) < setting_min[0]) { leader_only = true; }
                                    else { leader_only = false; }

                                    const processed_item = {
                                        List_Number: list_count,
                                        Number: unique_number[u],
                                        TitlePrefix: title_u_number[t1_index],
                                        TitleSuffix: 0,
                                        Equip1Name: equip_number[e1_index],
                                        Equip1Rank: equip_rank[e1_index],
                                        Equip2Name: equip_number[e2_index],
                                        Equip2Rank: equip_rank[e2_index],
                                        Leader_Torehan: unique_leader_torehan[u],
                                        Leader_Only: leader_only,

                                        SimSkill1: e2_count1,
                                        SimSkill2: e2_count2,
                                        SimSkill3: e2_count3,
                                        SimSkill4: e2_count4,
                                        SimSkill5: e2_count5,
                                        SimSkill6: e2_count6,
                                        SimSkill7: e2_count7,
                                        SimSkill8: e2_count8,
                                        SimSkill9: e2_count9,
                                        SimSkill1Pow: e2_pow1,
                                        SimSkill2Pow: e2_pow2,
                                        SimSkill3Pow: e2_pow3,
                                        SimSkill4Pow: e2_pow4,
                                        SimSkill5Pow: e2_pow5,
                                        SimSkill6Pow: e2_pow6,
                                        SimSkill7Pow: e2_pow7,
                                        SimSkill8Pow: e2_pow8,
                                        SimSkill9Pow: e2_pow9
                                    };
                                    result_unit_list.push(processed_item);
                                    list_count++;

                                    if (list_count > list_limit) {
                                        self.postMessage({ action: "cancelled", payload: 2 });
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
        if (is_common === 1) {

            //#region
            const common_number = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Number));
            const common_kago1 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Kago1));
            const common_kago2 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Kago2));
            const common_slay = new Uint32Array(inputData.Sim_Unit_C.map(item => item.Slay));
            const common_growth = new Uint16Array(inputData.Sim_Unit_C.map(item => item.GrowthRank));
            const common_equip1 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.CategoryEquip1));
            const common_equip2 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.CategoryEquip2));
            const common_leader_torehan = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Leader_Torehan));
            const common_p1 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow1));
            const common_p2 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow2));
            const common_p3 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow3));
            const common_p4 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow4));
            const common_p5 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow5));
            const common_p6 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow6));
            const common_p7 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow7));
            const common_p8 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow8));
            const common_p9 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow9));
            const common_c1 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count1));
            const common_c2 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count2));
            const common_c3 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count3));
            const common_c4 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count4));
            const common_c5 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count5));
            const common_c6 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count6));
            const common_c7 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count7));
            const common_c8 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count8));
            const common_c9 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count9));
            //#endregion
            const gekiha_c_count = new Uint16Array(inputData.Gekiha_Count_C);
            const gekiha_c_offset = new Uint16Array(inputData.Gekiha_Offset_C);
            const gekiha_c_values = new Uint16Array(inputData.Gekiha_Values_C);
            const gurume_c_count = new Uint16Array(inputData.Gurume_Count_C);
            const gurume_c_offset = new Uint16Array(inputData.Gurume_Offset_C);
            const gurume_c_values = new Uint16Array(inputData.Gurume_Values_C);
            //#region
            const title_pre_number = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Number));
            const title_pre_rank = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Rank));
            const title_pre_kago1 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.TitleKago1));
            const title_pre_slay1 = new Uint32Array(inputData.Sim_Title_C1.map(item => item.TitleSlay1));
            const title_pre_gekiha1 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Gekiha1));
            const title_pre_gurume1 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Gurume1));
            const title_c_pre_p1 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow1));
            const title_c_pre_p2 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow2));
            const title_c_pre_p3 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow3));
            const title_c_pre_p4 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow4));
            const title_c_pre_p5 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow5));
            const title_c_pre_p6 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow6));
            const title_c_pre_p7 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow7));
            const title_c_pre_p8 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow8));
            const title_c_pre_p9 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow9));

            const title_c_pre_c1 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count1));
            const title_c_pre_c2 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count2));
            const title_c_pre_c3 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count3));
            const title_c_pre_c4 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count4));
            const title_c_pre_c5 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count5));
            const title_c_pre_c6 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count6));
            const title_c_pre_c7 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count7));
            const title_c_pre_c8 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count8));
            const title_c_pre_c9 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count9));
            const title_suf_number = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Number));
            const title_suf_rank = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Rank));
            const title_suf_kago2 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.TitleKago2));
            const title_suf_slay2 = new Uint32Array(inputData.Sim_Title_C2.map(item => item.TitleSlay2));
            const title_suf_gekiha2 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Gekiha2));
            const title_suf_gurume2 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Gurume2));
            const title_c_suf_p1 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow1));
            const title_c_suf_p2 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow2));
            const title_c_suf_p3 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow3));
            const title_c_suf_p4 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow4));
            const title_c_suf_p5 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow5));
            const title_c_suf_p6 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow6));
            const title_c_suf_p7 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow7));
            const title_c_suf_p8 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow8));
            const title_c_suf_p9 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow9));
            const title_c_suf_c1 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count1));
            const title_c_suf_c2 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count2));
            const title_c_suf_c3 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count3));
            const title_c_suf_c4 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count4));
            const title_c_suf_c5 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count5));
            const title_c_suf_c6 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count6));
            const title_c_suf_c7 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count7));
            const title_c_suf_c8 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count8));
            const title_c_suf_c9 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count9));
            const t_count_pre = title_pre_number.length;
            const t_count_suf = title_suf_number.length;
            const t_match1 = new Uint32Array(t_count_pre);
            const t_match2 = new Uint32Array(t_count_suf);
            //#endregion
            const u_count = common_number.length;
            let gg_unit = [];
            if (gekiha_reject > 0) {
                let gg_and = 0;
                for (let ss = 0; ss < 9; ss++) {
                    if (setting_name[ss] === 2) {
                        if (setting_mode[ss] === 1) {
                            gg_and = 1;
                            break;
                        }
                    }
                }
                if (gg_and === 0) {
                    for (let gg = 0; gg < u_count; gg++) {
                        if (gekiha_c_count[gg] > 0) {
                            gg_unit.push(gg);
                        }
                    }
                }
            }
            if (gurume_reject > 0) {
                let gg_and = 0;
                for (let ss = 0; ss < 9; ss++) {
                    if (setting_name[ss] === 3) {
                        if (setting_mode[ss] === 1) {
                            gg_and = 1;
                            break;
                        }
                    }
                }
                if (gg_and === 0) {
                    for (let gg = 0; gg < u_count; gg++) {
                        if (gurume_c_count[gg] > 0) {
                            gg_unit.push(gg);
                        }
                    }
                }
            }
            for (let u = 0; u < u_count; u++) {
                await new Promise(resolve => setTimeout(resolve, 1));
                counter++;
                self.postMessage({ action: "progress", payload: counter });
                //#region
                if (setting_mode[0] === 4 && (common_c1[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[1] === 4 && (common_c2[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[2] === 4 && (common_c3[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[3] === 4 && (common_c4[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[4] === 4 && (common_c5[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[5] === 4 && (common_c6[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[6] === 4 && (common_c7[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[7] === 4 && (common_c8[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[8] === 4 && (common_c9[u] === 1 || gg_unit.includes(u))) continue;
                //#endregion
                //#region
                const u_rank = common_growth[u];
                let t_count1 = 0;
                let t_count2 = 0;
                for (let t = 0; t < t_count_pre; t++) {
                    if (u_rank < title_pre_rank[t]) continue;
                    t_match1[t_count1++] = t;
                }
                for (let t = 0; t < t_count_suf; t++) {
                    if (u_rank < title_suf_rank[t]) continue;
                    t_match2[t_count2++] = t;
                }
                //#endregion
                //#region
                const e_type1 = common_equip1[u];
                const e_type2 = common_equip2[u];
                for (let bit1 = 0; bit1 < 13; bit1++) {
                    if ((e_type1 & (1 << bit1)) === 0) continue;
                    const e_match1 = itemBuckets[bit1];
                    for (let bit2 = 0; bit2 < 13; bit2++) {
                        if ((e_type2 & (1 << bit2)) === 0) continue;
                        const e_match2 = itemBuckets[bit2];
                        //#endregion
                        for (let t1 = 0; t1 < t_count1; t1++) {
                            const t1_index = t_match1[t1];
                            //#region
                            const t1_pow1 = common_p1[u] + title_c_pre_p1[t1_index];
                            const t1_pow2 = common_p2[u] + title_c_pre_p2[t1_index];
                            const t1_pow3 = common_p3[u] + title_c_pre_p3[t1_index];
                            const t1_pow4 = common_p4[u] + title_c_pre_p4[t1_index];
                            const t1_pow5 = common_p5[u] + title_c_pre_p5[t1_index];
                            const t1_pow6 = common_p6[u] + title_c_pre_p6[t1_index];
                            const t1_pow7 = common_p7[u] + title_c_pre_p7[t1_index];
                            const t1_pow8 = common_p8[u] + title_c_pre_p8[t1_index];
                            const t1_pow9 = common_p9[u] + title_c_pre_p9[t1_index];
                            const t1_count1 = common_c1[u] + title_c_pre_c1[t1_index];
                            const t1_count2 = common_c2[u] + title_c_pre_c2[t1_index];
                            const t1_count3 = common_c3[u] + title_c_pre_c3[t1_index];
                            const t1_count4 = common_c4[u] + title_c_pre_c4[t1_index];
                            const t1_count5 = common_c5[u] + title_c_pre_c5[t1_index];
                            const t1_count6 = common_c6[u] + title_c_pre_c6[t1_index];
                            const t1_count7 = common_c7[u] + title_c_pre_c7[t1_index];
                            const t1_count8 = common_c8[u] + title_c_pre_c8[t1_index];
                            const t1_count9 = common_c9[u] + title_c_pre_c9[t1_index];
                            //#endregion
                            for (let t2 = 0; t2 < t_count2; t2++) {
                                const t2_index = t_match2[t2];
                                //#region
                                const t2_pow1 = t1_pow1 + title_c_suf_p1[t2_index];
                                const t2_pow2 = t1_pow2 + title_c_suf_p2[t2_index];
                                const t2_pow3 = t1_pow3 + title_c_suf_p3[t2_index];
                                const t2_pow4 = t1_pow4 + title_c_suf_p4[t2_index];
                                const t2_pow5 = t1_pow5 + title_c_suf_p5[t2_index];
                                const t2_pow6 = t1_pow6 + title_c_suf_p6[t2_index];
                                const t2_pow7 = t1_pow7 + title_c_suf_p7[t2_index];
                                const t2_pow8 = t1_pow8 + title_c_suf_p8[t2_index];
                                const t2_pow9 = t1_pow9 + title_c_suf_p9[t2_index];
                                const t2_count1 = t1_count1 + title_c_suf_c1[t2_index];
                                const t2_count2 = t1_count2 + title_c_suf_c2[t2_index];
                                const t2_count3 = t1_count3 + title_c_suf_c3[t2_index];
                                const t2_count4 = t1_count4 + title_c_suf_c4[t2_index];
                                const t2_count5 = t1_count5 + title_c_suf_c5[t2_index];
                                const t2_count6 = t1_count6 + title_c_suf_c6[t2_index];
                                const t2_count7 = t1_count7 + title_c_suf_c7[t2_index];
                                const t2_count8 = t1_count8 + title_c_suf_c8[t2_index];
                                const t2_count9 = t1_count9 + title_c_suf_c9[t2_index];
                                //#endregion
                                //#region
                                if (t2_pow1 === 0 && t2_count1 > 1) continue;
                                if (t2_pow2 === 0 && t2_count2 > 1) continue;
                                if (t2_pow3 === 0 && t2_count3 > 1) continue;
                                if (t2_pow4 === 0 && t2_count4 > 1) continue;
                                if (t2_pow5 === 0 && t2_count5 > 1) continue;
                                if (t2_pow6 === 0 && t2_count6 > 1) continue;
                                if (t2_pow7 === 0 && t2_count7 > 1) continue;
                                if (t2_pow8 === 0 && t2_count8 > 1) continue;
                                if (t2_pow9 === 0 && t2_count9 > 1) continue;
                                //#endregion
                                //#region
                                if (filter_kago > 0) {
                                    let bit_kago = 0;
                                    if (title_pre_kago1[t1_index] > 0) {
                                        bit_kago |= title_pre_kago1[t1_index];
                                    }
                                    else {
                                        bit_kago |= common_kago1[u];
                                    }
                                    if (title_suf_kago2[t2_index] > 0) {
                                        bit_kago |= title_suf_kago2[t2_index];
                                    }
                                    else {
                                        if (common_kago2[u] > 0) {
                                            bit_kago |= common_kago2[u];
                                        }
                                    }
                                    if (filter_kago_or === 1) {
                                        if ((bit_kago & filter_kago) === 0) continue;
                                    }
                                    else {
                                        if ((bit_kago & filter_kago) !== filter_kago) continue;
                                    }
                                }
                                //#endregion
                                for (let e1 = 0; e1 < e_match1.length; e1++) {
                                    const e1_index = e_match1[e1];
                                    //#region
                                    const e1_pow1 = t2_pow1 + equip_p1[e1_index];
                                    const e1_pow2 = t2_pow2 + equip_p2[e1_index];
                                    const e1_pow3 = t2_pow3 + equip_p3[e1_index];
                                    const e1_pow4 = t2_pow4 + equip_p4[e1_index];
                                    const e1_pow5 = t2_pow5 + equip_p5[e1_index];
                                    const e1_pow6 = t2_pow6 + equip_p6[e1_index];
                                    const e1_pow7 = t2_pow7 + equip_p7[e1_index];
                                    const e1_pow8 = t2_pow8 + equip_p8[e1_index];
                                    const e1_pow9 = t2_pow9 + equip_p9[e1_index];
                                    const e1_count1 = t2_count1 + equip_c1[e1_index];
                                    const e1_count2 = t2_count2 + equip_c2[e1_index];
                                    const e1_count3 = t2_count3 + equip_c3[e1_index];
                                    const e1_count4 = t2_count4 + equip_c4[e1_index];
                                    const e1_count5 = t2_count5 + equip_c5[e1_index];
                                    const e1_count6 = t2_count6 + equip_c6[e1_index];
                                    const e1_count7 = t2_count7 + equip_c7[e1_index];
                                    const e1_count8 = t2_count8 + equip_c8[e1_index];
                                    const e1_count9 = t2_count9 + equip_c9[e1_index];
                                    //#endregion
                                    for (let e2 = 0; e2 < e_match2.length; e2++) {
                                        const e2_index = e_match2[e2];
                                        //#region
                                        if (filter_slay > 0) {
                                            let bit_slay = common_slay[u] | title_pre_slay1[t1_index] | title_suf_slay2[t2_index] |
                                                equip_slay1[e1_index] | equip_slay2[e1_index] | equip_slay1[e2_index] | equip_slay2[e2_index];
                                            if (filter_slay_or === 1) {
                                                if ((bit_slay & filter_slay) === 0) continue;
                                            }
                                            else {
                                                if (filter_slay === 4194304) {
                                                    if (bit_slay !== 4194304) continue;
                                                }
                                                else if ((bit_slay & filter_slay) !== filter_slay) continue;
                                            }
                                        }
                                        //#endregion
                                        //#region
                                        let skillcheck = 0;
                                        let e2_pow1 = e1_pow1 + equip_p1[e2_index];
                                        let e2_pow2 = e1_pow2 + equip_p2[e2_index];
                                        let e2_pow3 = e1_pow3 + equip_p3[e2_index];
                                        let e2_pow4 = e1_pow4 + equip_p4[e2_index];
                                        let e2_pow5 = e1_pow5 + equip_p5[e2_index];
                                        let e2_pow6 = e1_pow6 + equip_p6[e2_index];
                                        let e2_pow7 = e1_pow7 + equip_p7[e2_index];
                                        let e2_pow8 = e1_pow8 + equip_p8[e2_index];
                                        let e2_pow9 = e1_pow9 + equip_p9[e2_index];
                                        let e2_count1 = e1_count1 + equip_c1[e2_index];
                                        let e2_count2 = e1_count2 + equip_c2[e2_index];
                                        let e2_count3 = e1_count3 + equip_c3[e2_index];
                                        let e2_count4 = e1_count4 + equip_c4[e2_index];
                                        let e2_count5 = e1_count5 + equip_c5[e2_index];
                                        let e2_count6 = e1_count6 + equip_c6[e2_index];
                                        let e2_count7 = e1_count7 + equip_c7[e2_index];
                                        let e2_count8 = e1_count8 + equip_c8[e2_index];
                                        let e2_count9 = e1_count9 + equip_c9[e2_index];
                                        //#endregion
                                        if (has_gekiha === 1) {
                                            const _g_count = gekiha_c_count[u];
                                            const _g_offset = gekiha_c_offset[u];
                                            let has_gekiha_count = 0;
                                            if (title_pre_gekiha1[t1_index] > 0) has_gekiha_count++;
                                            if (title_suf_gekiha2[t2_index] > 0) has_gekiha_count++;
                                            if (equip_gekiha1[e1_index] > 0) has_gekiha_count++;
                                            if (equip_gekiha2[e1_index] > 0) has_gekiha_count++;
                                            if (equip_gekiha1[e2_index] > 0) has_gekiha_count++;
                                            if (equip_gekiha2[e2_index] > 0) has_gekiha_count++;
                                            const total_count_g = _g_count + has_gekiha_count;
                                            if (total_count_g === 0 || total_count_g < setting_gekiha_count) continue;

                                            const has_power_g = new Uint16Array(total_count_g);
                                            for (let g = 0; g < _g_count; g++) {
                                                has_power_g[g] = gekiha_c_values[g + _g_offset];
                                            }
                                            has_gekiha_count = 0;
                                            if (title_pre_gekiha1[t1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = title_pre_gekiha1[t1_index];
                                            if (title_suf_gekiha2[t2_index] > 0) has_power_g[_g_count + has_gekiha_count++] = title_suf_gekiha2[t2_index];
                                            if (equip_gekiha1[e1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha1[e1_index];
                                            if (equip_gekiha2[e1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha2[e1_index];
                                            if (equip_gekiha1[e2_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha1[e2_index];
                                            if (equip_gekiha2[e2_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha2[e2_index];
                                            let simple_count = 0;
                                            for (let g = 0; g < total_count_g; g++) {
                                                if (has_power_g[g] >= gekiha_min && has_power_g[g] <= gekiha_max) simple_count++;
                                            }
                                            if (setting_gekiha_count > simple_count) continue;
                                            const loop_indices = new Int16Array(setting_gekiha_count).fill(0);
                                            const selected_indices = new Int16Array(setting_gekiha_count).fill(-1);
                                            const used = new Uint8Array(total_count_g).fill(0);

                                            let current_depth = 0;
                                            let gekiha_check = 0;
                                            while (current_depth >= 0) {
                                                if (current_depth === setting_gekiha_count) {
                                                    gekiha_check = 1;
                                                    break;
                                                }
                                                const Min = setting_gekiha_min[current_depth];
                                                const Max = setting_gekiha_max[current_depth];
                                                let found = false;
                                                for (let i = loop_indices[current_depth]; i < total_count_g; i++) {
                                                    if (used[i] === 0) {
                                                        const val = has_power_g[i];
                                                        if (val >= Min && val <= Max) {
                                                            used[i] = 1;
                                                            selected_indices[current_depth] = i;
                                                            loop_indices[current_depth] = i + 1;
                                                            found = true;
                                                            break;
                                                        }
                                                    }
                                                }

                                                if (found) {
                                                    current_depth++;
                                                } else {
                                                    loop_indices[current_depth] = 0;
                                                    current_depth--;
                                                    if (current_depth >= 0) {
                                                        const prev_idx = selected_indices[current_depth];
                                                        used[prev_idx] = 0;
                                                    }
                                                }
                                            }
                                            if (gekiha_check === 0) continue;
                                            let selected_g_index = 0;
                                            let selected_g_count = 0;
                                            if (setting_name[0] === 2 && setting_mode[0] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow1 = has_power_g[selected_g_index];
                                                e2_count1 = 1;
                                            }
                                            if (setting_name[1] === 2 && setting_mode[1] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow2 = has_power_g[selected_g_index];
                                                e2_count2 = 1;
                                            }
                                            if (setting_name[2] === 2 && setting_mode[2] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow3 = has_power_g[selected_g_index];
                                                e2_count3 = 1;
                                            }
                                            if (setting_name[3] === 2 && setting_mode[3] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow4 = has_power_g[selected_g_index];
                                                e2_count4 = 1;
                                            }
                                            if (setting_name[4] === 2 && setting_mode[4] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow5 = has_power_g[selected_g_index];
                                                e2_count5 = 1;
                                            }
                                            if (setting_name[5] === 2 && setting_mode[5] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow6 = has_power_g[selected_g_index];
                                                e2_count6 = 1;
                                            }
                                            if (setting_name[6] === 2 && setting_mode[6] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow7 = has_power_g[selected_g_index];
                                                e2_count7 = 1;
                                            }
                                            if (setting_name[7] === 2 && setting_mode[7] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow8 = has_power_g[selected_g_index];
                                                e2_count8 = 1;
                                            }
                                            if (setting_name[8] === 2 && setting_mode[8] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow9 = has_power_g[selected_g_index];
                                                e2_count9 = 1;
                                            }
                                        }

                                        if (has_gurume === 1) {
                                            const _g_count = gurume_c_count[u];
                                            const _g_offset = gurume_c_offset[u];
                                            let has_gurume_count = 0;
                                            if (title_pre_gurume1[t1_index] > 0) has_gurume_count++;
                                            if (title_suf_gurume2[t2_index] > 0) has_gurume_count++;
                                            if (equip_gurume1[e1_index] > 0) has_gurume_count++;
                                            if (equip_gurume2[e1_index] > 0) has_gurume_count++;
                                            if (equip_gurume1[e2_index] > 0) has_gurume_count++;
                                            if (equip_gurume2[e2_index] > 0) has_gurume_count++;

                                            const total_count_g = _g_count + has_gurume_count;
                                            if (total_count_g === 0 || total_count_g < setting_gurume_count) continue;

                                            const has_power_g = new Uint16Array(total_count_g);
                                            for (let g = 0; g < _g_count; g++) {
                                                has_power_g[g] = gurume_c_values[g + _g_offset];
                                            }
                                            has_gurume_count = 0;
                                            if (title_pre_gurume1[t1_index] > 0) has_power_g[_g_count + has_gurume_count++] = title_pre_gurume1[t1_index];
                                            if (title_suf_gurume2[t2_index] > 0) has_power_g[_g_count + has_gurume_count++] = title_suf_gurume2[t2_index];
                                            if (equip_gurume1[e1_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume1[e1_index];
                                            if (equip_gurume2[e1_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume2[e1_index];
                                            if (equip_gurume1[e2_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume1[e2_index];
                                            if (equip_gurume2[e2_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume2[e2_index];

                                            let simple_count = 0;
                                            for (let g = 0; g < total_count_g; g++) {
                                                if (has_power_g[g] >= gurume_min && has_power_g[g] <= gurume_max) simple_count++;
                                            }
                                            if (setting_gurume_count > simple_count) continue;
                                            const loop_indices = new Int16Array(setting_gurume_count).fill(0);
                                            const selected_indices = new Int16Array(setting_gurume_count).fill(-1);
                                            const used = new Uint8Array(total_count_g).fill(0);

                                            let current_depth = 0;
                                            let gurume_check = 0;
                                            while (current_depth >= 0) {
                                                if (current_depth === setting_gurume_count) {
                                                    gurume_check = 1;
                                                    break;
                                                }
                                                const Min = setting_gurume_min[current_depth];
                                                const Max = setting_gurume_max[current_depth];
                                                let found = false;
                                                for (let i = loop_indices[current_depth]; i < total_count_g; i++) {
                                                    if (used[i] === 0) {
                                                        const val = has_power_g[i];
                                                        if (val >= Min && val <= Max) {
                                                            used[i] = 1;
                                                            selected_indices[current_depth] = i;
                                                            loop_indices[current_depth] = i + 1;
                                                            found = true;
                                                            break;
                                                        }
                                                    }
                                                }

                                                if (found) {
                                                    current_depth++;
                                                } else {
                                                    loop_indices[current_depth] = 0;
                                                    current_depth--;
                                                    if (current_depth >= 0) {
                                                        const prev_idx = selected_indices[current_depth];
                                                        used[prev_idx] = 0;
                                                    }
                                                }
                                            }
                                            if (gurume_check === 0) continue;
                                            let selected_g_index = 0;
                                            let selected_g_count = 0;
                                            if (setting_name[0] === 3 && setting_mode[0] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow1 = has_power_g[selected_g_index];
                                                e2_count1 = 1;
                                            }
                                            if (setting_name[1] === 3 && setting_mode[1] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow2 = has_power_g[selected_g_index];
                                                e2_count2 = 1;
                                            }
                                            if (setting_name[2] === 3 && setting_mode[2] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow3 = has_power_g[selected_g_index];
                                                e2_count3 = 1;
                                            }
                                            if (setting_name[3] === 3 && setting_mode[3] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow4 = has_power_g[selected_g_index];
                                                e2_count4 = 1;
                                            }
                                            if (setting_name[4] === 3 && setting_mode[4] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow5 = has_power_g[selected_g_index];
                                                e2_count5 = 1;
                                            }
                                            if (setting_name[5] === 3 && setting_mode[5] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow6 = has_power_g[selected_g_index];
                                                e2_count6 = 1;
                                            }
                                            if (setting_name[6] === 3 && setting_mode[6] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow7 = has_power_g[selected_g_index];
                                                e2_count7 = 1;
                                            }
                                            if (setting_name[7] === 3 && setting_mode[7] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow8 = has_power_g[selected_g_index];
                                                e2_count8 = 1;
                                            }
                                            if (setting_name[8] === 3 && setting_mode[8] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow9 = has_power_g[selected_g_index];
                                                e2_count9 = 1;
                                            }
                                        }
                                        skillcheck = 1;
                                        //#region
                                        if (setting_mode[0] === 1) {
                                            skillcheck = 0;
                                            if (e2_count1 === 0) continue;
                                            if (e2_pow1 === 0) { }
                                            else if (e2_pow1 < setting_min[0] || setting_max[0] < e2_pow1) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[1] === 1) {
                                            skillcheck = 0;
                                            if (e2_count2 === 0) continue;
                                            if (e2_pow2 === 0) { }
                                            else if (e2_pow2 < setting_min[1] || setting_max[1] < e2_pow2) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[2] === 1) {
                                            skillcheck = 0;
                                            if (e2_count3 === 0) continue;
                                            if (e2_pow3 === 0) { }
                                            else if (e2_pow3 < setting_min[2] || setting_max[2] < e2_pow3) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[3] === 1) {
                                            skillcheck = 0;
                                            if (e2_count4 === 0) continue;
                                            if (e2_pow4 === 0) { }
                                            else if (e2_pow4 < setting_min[3] || setting_max[3] < e2_pow4) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[4] === 1) {
                                            skillcheck = 0;
                                            if (e2_count5 === 0) continue;
                                            if (e2_pow5 === 0) { }
                                            else if (e2_pow5 < setting_min[4] || setting_max[4] < e2_pow5) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[5] === 1) {
                                            skillcheck = 0;
                                            if (e2_count6 === 0) continue;
                                            if (e2_pow6 === 0) { }
                                            else if (e2_pow6 < setting_min[5] || setting_max[5] < e2_pow6) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[6] === 1) {
                                            skillcheck = 0;
                                            if (e2_count7 === 0) continue;
                                            if (e2_pow7 === 0) { }
                                            else if (e2_pow7 < setting_min[6] || setting_max[6] < e2_pow7) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[7] === 1) {
                                            skillcheck = 0;
                                            if (e2_count8 === 0) continue;
                                            if (e2_pow8 === 0) { }
                                            else if (e2_pow8 < setting_min[7] || setting_max[7] < e2_pow8) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[8] === 1) {
                                            skillcheck = 0;
                                            if (e2_count9 === 0) continue;
                                            if (e2_pow9 === 0) { }
                                            else if (e2_pow9 < setting_min[8] || setting_max[8] < e2_pow9) continue;
                                            skillcheck = 1;
                                        }
                                        if (skillcheck === 0) continue;
                                        //#endregion
                                        //#region
                                        if (can_or === 1) {
                                            skillcheck = 0;
                                            if (setting_mode[0] === 2 && setting_name[0] === 1) {
                                                if (e2_count1 > 0) {
                                                    if (e2_pow1 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow1 >= setting_min[0] && setting_max[0] >= e2_pow1) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count1 = 0;
                                                        e2_pow1 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[1] === 2 && setting_name[1] === 1) {
                                                if (e2_count2 > 0) {
                                                    if (e2_pow2 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow2 >= setting_min[1] && setting_max[1] >= e2_pow2) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count2 = 0;
                                                        e2_pow2 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[2] === 2 && setting_name[2] === 1) {
                                                if (e2_count3 > 0) {
                                                    if (e2_pow3 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow3 >= setting_min[2] && setting_max[2] >= e2_pow3) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count3 = 0;
                                                        e2_pow3 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[3] === 2 && setting_name[3] === 1) {
                                                if (e2_count4 > 0) {
                                                    if (e2_pow4 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow4 >= setting_min[3] && setting_max[3] >= e2_pow4) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count4 = 0;
                                                        e2_pow4 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[4] === 2 && setting_name[4] === 1) {
                                                if (e2_count5 > 0) {
                                                    if (e2_pow5 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow5 >= setting_min[4] && setting_max[4] >= e2_pow5) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count5 = 0;
                                                        e2_pow5 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[5] === 2 && setting_name[5] === 1) {
                                                if (e2_count6 > 0) {
                                                    if (e2_pow6 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow6 >= setting_min[5] && setting_max[5] >= e2_pow6) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count6 = 0;
                                                        e2_pow6 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[6] === 2 && setting_name[6] === 1) {
                                                if (e2_count7 > 0) {
                                                    if (e2_pow7 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow7 >= setting_min[6] && setting_max[6] >= e2_pow7) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count7 = 0;
                                                        e2_pow7 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[7] === 2 && setting_name[7] === 1) {
                                                if (e2_count8 > 0) {
                                                    if (e2_pow8 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow8 >= setting_min[7] && setting_max[7] >= e2_pow8) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count8 = 0;
                                                        e2_pow8 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[8] === 2 && setting_name[8] === 1) {
                                                if (e2_count9 > 0) {
                                                    if (e2_pow9 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow9 >= setting_min[8] && setting_max[8] >= e2_pow9) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count9 = 0;
                                                        e2_pow9 = 0;
                                                    }
                                                }
                                            }
                                            if (skillcheck === 0) continue;
                                        }
                                        //#endregion
                                        if ((e2_pow1 - common_leader_torehan[u]) < setting_min[0]) { leader_only = true; }
                                        else { leader_only = false; }

                                        const processed_item = {
                                            List_Number: list_count,
                                            Number: common_number[u],
                                            TitlePrefix: title_pre_number[t1_index],
                                            TitleSuffix: title_suf_number[t2_index],
                                            Equip1Name: equip_number[e1_index],
                                            Equip1Rank: equip_rank[e1_index],
                                            Equip2Name: equip_number[e2_index],
                                            Equip2Rank: equip_rank[e2_index],
                                            Leader_Torehan: common_leader_torehan[u],
                                            Leader_Only: leader_only,

                                            SimSkill1: e2_count1,
                                            SimSkill2: e2_count2,
                                            SimSkill3: e2_count3,
                                            SimSkill4: e2_count4,
                                            SimSkill5: e2_count5,
                                            SimSkill6: e2_count6,
                                            SimSkill7: e2_count7,
                                            SimSkill8: e2_count8,
                                            SimSkill9: e2_count9,
                                            SimSkill1Pow: e2_pow1,
                                            SimSkill2Pow: e2_pow2,
                                            SimSkill3Pow: e2_pow3,
                                            SimSkill4Pow: e2_pow4,
                                            SimSkill5Pow: e2_pow5,
                                            SimSkill6Pow: e2_pow6,
                                            SimSkill7Pow: e2_pow7,
                                            SimSkill8Pow: e2_pow8,
                                            SimSkill9Pow: e2_pow9
                                        };
                                        result_unit_list.push(processed_item);

                                        list_count++;

                                        if (list_count > list_limit) {
                                            self.postMessage({ action: "cancelled", payload: 2 });
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

        await new Promise(resolve => setTimeout(resolve, 1));
        self.postMessage({ action: "preresult", payload: 2 });
        await new Promise(resolve => setTimeout(resolve, 1));
        //#region
        result_unit_list.sort((a, b) => b.SimSkill1Pow - a.SimSkill1Pow);
        let names = [];
        let name_list = [];
        for (const unit of result_unit_list) {
            if (unit.Leader_Torehan > 0) {
                if (!names.includes(unit.Number)) {
                    names.push(unit.Number);
                    name_list.push([unit.Number, unit.TitlePrefix, unit.TitleSuffix]);
                    if (name_list.length === 30) {
                        break;
                    }
                }
            }
        }
        if (names.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 1));
            self.postMessage({ action: "cancelled", payload: 11 });
            return;
        }
        const leader = [];
        let count = 0;
        for (const unit of name_list) {
            count = 0;
            for (const uni of result_unit_list) {
                if (uni.Number === unit[0]) {
                    if (uni.TitlePrefix === unit[1] && uni.TitleSuffix === unit[2]) {
                        leader.push(uni.List_Number);
                        if (uni.Number < 200) {
                            n = Math.trunc(uni.Number / 10) * 10
                            leader.push(n);
                        }
                        else {
                            leader.push(uni.Number);
                        }
                        leader.push(uni.Equip1Name);
                        leader.push(uni.Equip1Rank);
                        leader.push(uni.Equip2Name);
                        leader.push(uni.Equip2Rank);
                        leader.push(uni.SimSkill1Pow);
                        count++;
                        if (count === 10) {
                            break;
                        }
                    }
                }
            }
        }
        result_unit_list.sort((a, b) => (b.SimSkill1Pow - b.Leader_Torehan) - (a.SimSkill1Pow - a.Leader_Torehan));
        names = [];
        name_list = [];
        for (const unit of result_unit_list) {
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
        if (names.length < 5) {
            await new Promise(resolve => setTimeout(resolve, 1));
            self.postMessage({ action: "cancelled", payload: 12 });
            return;
        }
        const members = [];
        for (const unit of name_list) {
            count = 0;
            for (const uni of result_unit_list) {
                if (!uni.Leader_Only) {
                    if (uni.Number === unit[0]) {
                        if (uni.TitlePrefix === unit[1] && uni.TitleSuffix === unit[2]) {
                            members.push(uni.List_Number);
                            if (uni.Number < 200) {
                                n = Math.trunc(uni.Number / 10) * 10
                                members.push(n);
                            }
                            else {

                                members.push(uni.Number);
                            }
                            members.push(uni.Equip1Name);
                            members.push(uni.Equip1Rank);
                            members.push(uni.Equip2Name);
                            members.push(uni.Equip2Rank);
                            members.push(uni.SimSkill1Pow - uni.Leader_Torehan);
                            count++;
                            if (count === 10) {
                                break;
                            }
                        }
                    }
                }
            }
        }

        const max_torehan_5 = (result_unit_list[0].SimSkill1Pow - result_unit_list[0].Leader_Torehan) +
            (result_unit_list[1].SimSkill1Pow - result_unit_list[1].Leader_Torehan) +
            (result_unit_list[2].SimSkill1Pow - result_unit_list[2].Leader_Torehan) +
            (result_unit_list[3].SimSkill1Pow - result_unit_list[3].Leader_Torehan) +
            (result_unit_list[4].SimSkill1Pow - result_unit_list[4].Leader_Torehan);
        const max_torehan_normal = result_unit_list[0].SimSkill1Pow - result_unit_list[0].Leader_Torehan;
        const leader_total = leader.length / 7
        const menber_total = members.length / 7;
        const rank_limit = new Int32Array(15);
        rank_limit[14] = 1; rank_limit[13] = 2; rank_limit[12] = 3; rank_limit[11] = 3;
        rank_limit[10] = 4; rank_limit[9] = 4; rank_limit[8] = 10;
        const used_unit = new Uint8Array(10000);
        const current_members = new Int32Array(6);
        let torehan_best_total = 0;
        let best_members = [];
        function check_torehan(unit_count, member_count, torehan_current_total) {
            if (member_count === 5) {
                if (torehan_current_total > torehan_best_total) {
                    torehan_best_total = torehan_current_total;
                    best_members = [[...current_members]];
                } else if (torehan_current_total === torehan_best_total && torehan_best_total > 0) {
                    if (best_members.length < 50) {
                        best_members.push([...current_members]);
                    }
                }
                return;
            }
            if (torehan_current_total + max_torehan_normal * (5 - member_count) < torehan_best_total) return;
            for (let i = unit_count; i < menber_total; i++) {
                const offset = i * 7;
                const uid = members[offset + 1];
                if (used_unit[uid]) continue;
                const e1_id = members[offset + 2], e1_r = members[offset + 3];
                const e2_id = members[offset + 4], e2_r = members[offset + 5];
                const normalskill = members[offset + 6];
                if (e1_r >= 9 && torehan_current[e1_id] + 1 > rank_limit[e1_r]) continue;
                if (e2_r >= 9 && torehan_current[e2_id] + 1 > rank_limit[e2_r]) continue;
                used_unit[uid] = 1;
                if (e1_r >= 9) torehan_current[e1_id]++;
                if (e2_r >= 9) torehan_current[e2_id]++;
                current_members[member_count] = members[offset];
                check_torehan(i + 1, member_count + 1, torehan_current_total + normalskill);
                if (e1_r >= 9) torehan_current[e1_id]--;
                if (e2_r >= 9) torehan_current[e2_id]--;
                used_unit[uid] = 0;
            }
        }
        for (let l = 0; l < leader_total; l++) {
            const offset = l * 7;
            const uid = leader[offset + 1];
            const e1_id = leader[offset + 2], e1_r = leader[offset + 3];
            const e2_id = leader[offset + 4], e2_r = leader[offset + 5];
            const leaderskill = leader[offset + 6];
            used_unit[uid] = 1;
            if (e1_r >= 9) torehan_current[e1_id]++;
            if (e2_r >= 9) torehan_current[e2_id]++;
            current_members[5] = leader[offset];
            if (leaderskill + max_torehan_5 < torehan_best_total) continue;
            check_torehan(0, 0, leaderskill);
            if (e1_r >= 9) torehan_current[e1_id]--;
            if (e2_r >= 9) torehan_current[e2_id]--;
            used_unit[uid] = 0;
        }
        result_unit_list.sort((a, b) => a.List_Number - b.List_Number);
        let party_id = [];
        let party_equip = [];
        let result = [];
        for (const list_number of best_members) {
            const n1 = result_unit_list[list_number[5]].Number;
            const n2 = result_unit_list[list_number[0]].Number;
            const n3 = result_unit_list[list_number[1]].Number;
            const n4 = result_unit_list[list_number[2]].Number;
            const n5 = result_unit_list[list_number[3]].Number;
            const n6 = result_unit_list[list_number[4]].Number;
            const temp = [n1, n2, n3, n4, n5, n6].slice(1).sort((a, b) => a - b);

            const e11 = result_unit_list[list_number[5]].Equip1Name;
            const e12 = result_unit_list[list_number[5]].Equip2Name;
            const e21 = result_unit_list[list_number[0]].Equip1Name;
            const e22 = result_unit_list[list_number[0]].Equip2Name;
            const e31 = result_unit_list[list_number[1]].Equip1Name;
            const e32 = result_unit_list[list_number[1]].Equip2Name;
            const e41 = result_unit_list[list_number[2]].Equip1Name;
            const e42 = result_unit_list[list_number[2]].Equip2Name;
            const e51 = result_unit_list[list_number[3]].Equip1Name;
            const e52 = result_unit_list[list_number[3]].Equip2Name;
            const e61 = result_unit_list[list_number[4]].Equip1Name;
            const e62 = result_unit_list[list_number[4]].Equip2Name;
            const e_temp = [e11, e12, e21, e22, e31, e32, e41, e42, e51, e52, e61, e62].sort((a, b) => a - b);
            
            const check = party_id.some(party =>
                party.units.every((val, i) => val === temp[i]) &&
                party.equips.every((val, i) => val === e_temp[i])
            );
            if (check === true) continue;
            party_id.push({ units: temp, equips: e_temp });            
            const l_temp = result_unit_list[list_number[5]];
            const p_temp = [
                result_unit_list[list_number[0]],
                result_unit_list[list_number[1]],
                result_unit_list[list_number[2]],
                result_unit_list[list_number[3]],
                result_unit_list[list_number[4]]
            ].sort((a, b) => {
                if ((a.SimSkill1Pow - a.Leader_Torehan) !== (b.SimSkill1Pow - b.Leader_Torehan)) {
                    return (b.SimSkill1Pow - b.Leader_Torehan) - (a.SimSkill1Pow - a.Leader_Torehan);
                }
                return a.Number - b.Number;
            });
            const r_temp = [l_temp, ...p_temp];
            result.push(r_temp);
        }
        if (result > list_limit / 10) {
            await new Promise(resolve => setTimeout(resolve, 1));
            self.postMessage({ action: "cancelled", payload: 13 });
            return;
        }
        let leader_index = 0;
        for (const party of result) {
            for (const item of party) {
                u16[idx++] = item.Number;
                u16[idx++] = item.TitlePrefix;
                u16[idx++] = item.TitleSuffix;
                u16[idx++] = item.Equip1Name;
                u16[idx++] = item.Equip2Name;
                u16[idx++] = item.SimSkill1;
                u16[idx++] = item.SimSkill2;
                u16[idx++] = item.SimSkill3;
                u16[idx++] = item.SimSkill4;
                u16[idx++] = item.SimSkill5;
                u16[idx++] = item.SimSkill6;
                u16[idx++] = item.SimSkill7;
                u16[idx++] = item.SimSkill8;
                u16[idx++] = item.SimSkill9;
                if (leader_index % 6 === 0) {
                    u16[idx++] = item.SimSkill1Pow;
                }
                else {
                    u16[idx++] = item.SimSkill1Pow - item.Leader_Torehan;
                }
                u16[idx++] = item.SimSkill2Pow;
                u16[idx++] = item.SimSkill3Pow;
                u16[idx++] = item.SimSkill4Pow;
                u16[idx++] = item.SimSkill5Pow;
                u16[idx++] = item.SimSkill6Pow;
                u16[idx++] = item.SimSkill7Pow;
                u16[idx++] = item.SimSkill8Pow;
                u16[idx++] = item.SimSkill9Pow;
                leader_index++;
            }
        }

        //#endregion

        await new Promise(resolve => setTimeout(resolve, 1));
        self.postMessage({ action: 'preresult', payload: 1 });
        await new Promise(resolve => setTimeout(resolve, 1));
        const resultBuffer = u16.buffer.slice(0, idx * 2);
        self.postMessage({ action: 'torehan', payload: resultBuffer }, [resultBuffer]);
    }
    else {
        if (is_unique === 1) {
            //#region
            const unique_number = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Number));
            const unique_kago1 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Kago1));
            const unique_kago2 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Kago2));
            const unique_slay = new Uint32Array(inputData.Sim_Unit_U.map(item => item.Slay));
            const unique_equip1 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.CategoryEquip1));
            const unique_equip2 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.CategoryEquip2));           

            const unique_leader_torehan = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Leader_Torehan));
            const unique_p1 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow1));
            const unique_p2 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow2));
            const unique_p3 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow3));
            const unique_p4 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow4));
            const unique_p5 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow5));
            const unique_p6 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow6));
            const unique_p7 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow7));
            const unique_p8 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow8));
            const unique_p9 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Pow9));
            const unique_c1 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count1));
            const unique_c2 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count2));
            const unique_c3 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count3));
            const unique_c4 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count4));
            const unique_c5 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count5));
            const unique_c6 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count6));
            const unique_c7 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count7));
            const unique_c8 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count8));
            const unique_c9 = new Uint16Array(inputData.Sim_Unit_U.map(item => item.Skill_Count9));
            //#endregion
            const gekiha_u_count = new Uint16Array(inputData.Gekiha_Count_U);
            const gekiha_u_offset = new Uint16Array(inputData.Gekiha_Offset_U);
            const gekiha_u_values = new Uint16Array(inputData.Gekiha_Values_U);

            const gurume_u_count = new Uint16Array(inputData.Gurume_Count_U);
            const gurume_u_offset = new Uint16Array(inputData.Gurume_Offset_U);
            const gurume_u_values = new Uint16Array(inputData.Gurume_Values_U);

            //#region
            const title_u_number = new Uint16Array(inputData.Sim_Title_U.map(item => item.Number));
            const title_u_namenumber = new Uint16Array(inputData.Sim_Title_U.map(item => item.NameForTitle));
            const title_u_kago1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.TitleKago1));
            const title_u_kago2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.TitleKago2));
            const title_u_slay1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.TitleSlay1));
            const title_u_slay2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.TitleSlay2));
            const title_u_gekiha1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Gekiha1));
            const title_u_gekiha2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Gekiha2));

            const title_u_gurume1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Gurume1));
            const title_u_gurume2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Gurume2));

            const title_u_p1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow1));
            const title_u_p2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow2));
            const title_u_p3 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow3));
            const title_u_p4 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow4));
            const title_u_p5 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow5));
            const title_u_p6 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow6));
            const title_u_p7 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow7));
            const title_u_p8 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow8));
            const title_u_p9 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Pow9));
            const title_u_c1 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count1));
            const title_u_c2 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count2));
            const title_u_c3 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count3));
            const title_u_c4 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count4));
            const title_u_c5 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count5));
            const title_u_c6 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count6));
            const title_u_c7 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count7));
            const title_u_c8 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count8));
            const title_u_c9 = new Uint16Array(inputData.Sim_Title_U.map(item => item.Skill_Count9));
            const t_count_unique = title_u_number.length;
            const t_match = new Uint32Array(t_count_unique);
            //#endregion
            const u_count = unique_number.length;
            let gg_unit = [];
            if (gekiha_reject > 0) {
                let gg_and = 0;
                for (let ss = 0; ss < 9; ss++) {
                    if (setting_name[ss] === 2) {
                        if (setting_mode[ss] === 1) {
                            gg_and = 1;
                            break;
                        }
                    }
                }
                if (gg_and === 0) {
                    for (let gg = 0; gg < u_count; gg++) {
                        if (gekiha_u_count[gg] > 0) {
                            gg_unit.push(gg);
                        }
                    }
                }
            }
            if (gurume_reject > 0) {
                let gg_and = 0;
                for (let ss = 0; ss < 9; ss++) {
                    if (setting_name[ss] === 3) {
                        if (setting_mode[ss] === 1) {
                            gg_and = 1;
                            break;
                        }
                    }
                }
                if (gg_and === 0) {
                    for (let gg = 0; gg < u_count; gg++) {
                        if (gurume_u_count[gg] > 0) {
                            gg_unit.push(gg);
                        }
                    }
                }
            }
            for (let u = 0; u < u_count; u++) {
                await new Promise(resolve => setTimeout(resolve, 1));
                counter++;
                self.postMessage({ action: "progress", payload: counter });
                //#region
                if (setting_mode[0] === 4 && (unique_c1[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[1] === 4 && (unique_c2[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[2] === 4 && (unique_c3[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[3] === 4 && (unique_c4[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[4] === 4 && (unique_c5[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[5] === 4 && (unique_c6[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[6] === 4 && (unique_c7[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[7] === 4 && (unique_c8[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[8] === 4 && (unique_c9[u] === 1 || gg_unit.includes(u))) continue;
                //#endregion
                //#region
                let t_count = 1;
                t_match[0] = 0;
                for (var t = 1; t < t_count_unique; t++) {
                    if (unique_number[u] !== title_u_namenumber[t]) continue;
                    t_match[t_count++] = t;
                }
                //#endregion
                //#region
                const e_type1 = unique_equip1[u];
                const e_type2 = unique_equip2[u];
                for (let bit1 = 0; bit1 < 14; bit1++) {
                    if ((e_type1 & (1 << bit1)) === 0) continue;
                    const e_match1 = itemBuckets[bit1];
                    for (let bit2 = 0; bit2 < 14; bit2++) {
                        if ((e_type2 & (1 << bit2)) === 0) continue;
                        const e_match2 = itemBuckets[bit2];
                        const e_match3 = itemBuckets[13];
                        //#endregion
                        for (let t1 = 0; t1 < t_count; t1++) {
                            const t1_index = t_match[t1];
                            //#region
                            const t1_pow1 = unique_p1[u] + title_u_p1[t1_index];
                            const t1_pow2 = unique_p2[u] + title_u_p2[t1_index];
                            const t1_pow3 = unique_p3[u] + title_u_p3[t1_index];
                            const t1_pow4 = unique_p4[u] + title_u_p4[t1_index];
                            const t1_pow5 = unique_p5[u] + title_u_p5[t1_index];
                            const t1_pow6 = unique_p6[u] + title_u_p6[t1_index];
                            const t1_pow7 = unique_p7[u] + title_u_p7[t1_index];
                            const t1_pow8 = unique_p8[u] + title_u_p8[t1_index];
                            const t1_pow9 = unique_p9[u] + title_u_p9[t1_index];
                            const t1_count1 = unique_c1[u] + title_u_c1[t1_index];
                            const t1_count2 = unique_c2[u] + title_u_c2[t1_index];
                            const t1_count3 = unique_c3[u] + title_u_c3[t1_index];
                            const t1_count4 = unique_c4[u] + title_u_c4[t1_index];
                            const t1_count5 = unique_c5[u] + title_u_c5[t1_index];
                            const t1_count6 = unique_c6[u] + title_u_c6[t1_index];
                            const t1_count7 = unique_c7[u] + title_u_c7[t1_index];
                            const t1_count8 = unique_c8[u] + title_u_c8[t1_index];
                            const t1_count9 = unique_c9[u] + title_u_c9[t1_index];
                            //#endregion
                            //#region
                            if (t1_pow1 === 0 && t1_count1 > 1) continue;
                            if (t1_pow2 === 0 && t1_count2 > 1) continue;
                            if (t1_pow3 === 0 && t1_count3 > 1) continue;
                            if (t1_pow4 === 0 && t1_count4 > 1) continue;
                            if (t1_pow5 === 0 && t1_count5 > 1) continue;
                            if (t1_pow6 === 0 && t1_count6 > 1) continue;
                            if (t1_pow7 === 0 && t1_count7 > 1) continue;
                            if (t1_pow8 === 0 && t1_count8 > 1) continue;
                            if (t1_pow9 === 0 && t1_count9 > 1) continue;
                            //#endregion
                            //#region
                            if (filter_kago > 0) {
                                let bit_kago = 0;
                                if (title_u_kago1[t1_index] > 0) {
                                    bit_kago |= title_u_kago1[t1_index];
                                }
                                else {
                                    bit_kago |= unique_kago1[u];
                                }
                                if (title_u_kago2[t1_index] > 0) {
                                    bit_kago |= title_u_kago2[t1_index];
                                }
                                else {
                                    if (unique_kago2[u] > 0) {
                                        bit_kago |= unique_kago2[u];
                                    }
                                }
                                if (filter_kago_or === 1) {
                                    if ((bit_kago & filter_kago) === 0) continue;
                                }
                                else {
                                    if ((bit_kago & filter_kago) !== filter_kago) continue;
                                }
                            }
                            //#endregion
                            for (let e1 = 0; e1 < e_match1.length; e1++) {
                                const e1_index = e_match1[e1];
                                //#region
                                const e1_pow1 = t1_pow1 + equip_p1[e1_index];
                                const e1_pow2 = t1_pow2 + equip_p2[e1_index];
                                const e1_pow3 = t1_pow3 + equip_p3[e1_index];
                                const e1_pow4 = t1_pow4 + equip_p4[e1_index];
                                const e1_pow5 = t1_pow5 + equip_p5[e1_index];
                                const e1_pow6 = t1_pow6 + equip_p6[e1_index];
                                const e1_pow7 = t1_pow7 + equip_p7[e1_index];
                                const e1_pow8 = t1_pow8 + equip_p8[e1_index];
                                const e1_pow9 = t1_pow9 + equip_p9[e1_index];
                                const e1_count1 = t1_count1 + equip_c1[e1_index];
                                const e1_count2 = t1_count2 + equip_c2[e1_index];
                                const e1_count3 = t1_count3 + equip_c3[e1_index];
                                const e1_count4 = t1_count4 + equip_c4[e1_index];
                                const e1_count5 = t1_count5 + equip_c5[e1_index];
                                const e1_count6 = t1_count6 + equip_c6[e1_index];
                                const e1_count7 = t1_count7 + equip_c7[e1_index];
                                const e1_count8 = t1_count8 + equip_c8[e1_index];
                                const e1_count9 = t1_count9 + equip_c9[e1_index];
                                //#endregion
                                for (let e2 = 0; e2 < e_match2.length; e2++) {
                                    const e2_index = e_match2[e2];

                                    //#region
                                    if (filter_slay > 0) {
                                        let bit_slay = unique_slay[u] | title_u_slay1[t1_index] | title_u_slay2[t1_index] |
                                            equip_slay1[e1_index] | equip_slay2[e1_index] | equip_slay1[e2_index] | equip_slay2[e2_index];
                                        if (filter_slay_or === 1) {
                                            if ((bit_slay & filter_slay) === 0) continue;
                                        }
                                        else {
                                            if (filter_slay === 4194304) {
                                                if (bit_slay !== 4194304) continue;
                                            }
                                            else if ((bit_slay & filter_slay) !== filter_slay) continue;
                                        }
                                    }
                                    //#endregion

                                    for (let e3 = 0; e3 < e_match3.length; e3++) {
                                        const e3_index = e_match3[e3];

                                        //#region
                                        let skillcheck = 0;
                                        let e2_pow1 = e1_pow1 + equip_p1[e2_index] + equip_p1[e3_index];
                                        let e2_pow2 = e1_pow2 + equip_p2[e2_index] + equip_p2[e3_index];
                                        let e2_pow3 = e1_pow3 + equip_p3[e2_index] + equip_p3[e3_index];
                                        let e2_pow4 = e1_pow4 + equip_p4[e2_index] + equip_p4[e3_index];
                                        let e2_pow5 = e1_pow5 + equip_p5[e2_index] + equip_p5[e3_index];
                                        let e2_pow6 = e1_pow6 + equip_p6[e2_index] + equip_p6[e3_index];
                                        let e2_pow7 = e1_pow7 + equip_p7[e2_index] + equip_p7[e3_index];
                                        let e2_pow8 = e1_pow8 + equip_p8[e2_index] + equip_p8[e3_index];
                                        let e2_pow9 = e1_pow9 + equip_p9[e2_index] + equip_p9[e3_index];
                                        let e2_count1 = e1_count1 + equip_c1[e2_index] + equip_c1[e3_index];
                                        let e2_count2 = e1_count2 + equip_c2[e2_index] + equip_c2[e3_index];
                                        let e2_count3 = e1_count3 + equip_c3[e2_index] + equip_c3[e3_index];
                                        let e2_count4 = e1_count4 + equip_c4[e2_index] + equip_c4[e3_index];
                                        let e2_count5 = e1_count5 + equip_c5[e2_index] + equip_c5[e3_index];
                                        let e2_count6 = e1_count6 + equip_c6[e2_index] + equip_c6[e3_index];
                                        let e2_count7 = e1_count7 + equip_c7[e2_index] + equip_c7[e3_index];
                                        let e2_count8 = e1_count8 + equip_c8[e2_index] + equip_c8[e3_index];
                                        let e2_count9 = e1_count9 + equip_c9[e2_index] + equip_c9[e3_index];
                                        //#endregion
                                        if (has_gekiha === 1) {
                                            const _g_count = gekiha_u_count[u];
                                            const _g_offset = gekiha_u_offset[u];
                                            let has_gekiha_count = 0;
                                            if (title_u_gekiha1[t1_index] > 0) has_gekiha_count++;
                                            if (title_u_gekiha2[t1_index] > 0) has_gekiha_count++;
                                            if (equip_gekiha1[e1_index] > 0) has_gekiha_count++;
                                            if (equip_gekiha2[e1_index] > 0) has_gekiha_count++;
                                            if (equip_gekiha1[e2_index] > 0) has_gekiha_count++;
                                            if (equip_gekiha2[e2_index] > 0) has_gekiha_count++;
                                            if (equip_gekiha1[e3_index] > 0) has_gekiha_count++;

                                            const total_count_g = _g_count + has_gekiha_count;
                                            if (total_count_g === 0 || total_count_g < setting_gekiha_count) continue;

                                            const has_power_g = new Uint16Array(total_count_g);
                                            for (let g = 0; g < _g_count; g++) {
                                                has_power_g[g] = gekiha_u_values[g + _g_offset];
                                            }
                                            has_gekiha_count = 0;
                                            if (title_u_gekiha1[t1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = title_u_gekiha1[t1_index];
                                            if (title_u_gekiha2[t1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = title_u_gekiha2[t1_index];
                                            if (equip_gekiha1[e1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha1[e1_index];
                                            if (equip_gekiha2[e1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha2[e1_index];
                                            if (equip_gekiha1[e2_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha1[e2_index];
                                            if (equip_gekiha2[e2_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha2[e2_index];
                                            if (equip_gekiha1[e3_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha1[e3_index];
                                            let simple_count = 0;
                                            for (let g = 0; g < total_count_g; g++) {
                                                if (has_power_g[g] >= gekiha_min && has_power_g[g] <= gekiha_max) simple_count++;
                                            }
                                            if (setting_gekiha_count > simple_count) continue;
                                            const loop_indices = new Int16Array(setting_gekiha_count).fill(0);
                                            const selected_indices = new Int16Array(setting_gekiha_count).fill(-1);
                                            const used = new Uint8Array(total_count_g).fill(0);

                                            let current_depth = 0;
                                            let gekiha_check = 0;
                                            while (current_depth >= 0) {
                                                if (current_depth === setting_gekiha_count) {
                                                    gekiha_check = 1;
                                                    break;
                                                }
                                                const Min = setting_gekiha_min[current_depth];
                                                const Max = setting_gekiha_max[current_depth];
                                                let found = false;
                                                for (let i = loop_indices[current_depth]; i < total_count_g; i++) {
                                                    if (used[i] === 0) {
                                                        const val = has_power_g[i];
                                                        if (val >= Min && val <= Max) {
                                                            used[i] = 1;
                                                            selected_indices[current_depth] = i;
                                                            loop_indices[current_depth] = i + 1;
                                                            found = true;
                                                            break;
                                                        }
                                                    }
                                                }

                                                if (found) {
                                                    current_depth++;
                                                } else {
                                                    loop_indices[current_depth] = 0;
                                                    current_depth--;
                                                    if (current_depth >= 0) {
                                                        const prev_idx = selected_indices[current_depth];
                                                        used[prev_idx] = 0;
                                                    }
                                                }
                                            }
                                            if (gekiha_check === 0) continue;
                                            let selected_g_index = 0;
                                            let selected_g_count = 0;
                                            if (setting_name[0] === 2 && setting_mode[0] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow1 = has_power_g[selected_g_index];
                                                e2_count1 = 1;
                                            }
                                            if (setting_name[1] === 2 && setting_mode[1] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow2 = has_power_g[selected_g_index];
                                                e2_count2 = 1;
                                            }
                                            if (setting_name[2] === 2 && setting_mode[2] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow3 = has_power_g[selected_g_index];
                                                e2_count3 = 1;
                                            }
                                            if (setting_name[3] === 2 && setting_mode[3] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow4 = has_power_g[selected_g_index];
                                                e2_count4 = 1;
                                            }
                                            if (setting_name[4] === 2 && setting_mode[4] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow5 = has_power_g[selected_g_index];
                                                e2_count5 = 1;
                                            }
                                            if (setting_name[5] === 2 && setting_mode[5] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow6 = has_power_g[selected_g_index];
                                                e2_count6 = 1;
                                            }
                                            if (setting_name[6] === 2 && setting_mode[6] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow7 = has_power_g[selected_g_index];
                                                e2_count7 = 1;
                                            }
                                            if (setting_name[7] === 2 && setting_mode[7] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow8 = has_power_g[selected_g_index];
                                                e2_count8 = 1;
                                            }
                                            if (setting_name[8] === 2 && setting_mode[8] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow9 = has_power_g[selected_g_index];
                                                e2_count9 = 1;
                                            }
                                        }

                                        if (has_gurume === 1) {
                                            const _g_count = gurume_u_count[u];
                                            const _g_offset = gurume_u_offset[u];
                                            let has_gurume_count = 0;

                                            if (title_u_gurume1[t1_index] > 0) has_gurume_count++;
                                            if (title_u_gurume2[t1_index] > 0) has_gurume_count++;
                                            if (equip_gurume1[e1_index] > 0) has_gurume_count++;
                                            if (equip_gurume2[e1_index] > 0) has_gurume_count++;
                                            if (equip_gurume1[e2_index] > 0) has_gurume_count++;
                                            if (equip_gurume2[e2_index] > 0) has_gurume_count++;
                                            if (equip_gurume1[e3_index] > 0) has_gurume_count++;

                                            const total_count_g = _g_count + has_gurume_count;
                                            if (total_count_g === 0 || total_count_g < setting_gurume_count) continue;

                                            const has_power_g = new Uint16Array(total_count_g);
                                            for (let g = 0; g < _g_count; g++) {
                                                has_power_g[g] = gurume_u_values[g + _g_offset];
                                            }
                                            has_gurume_count = 0;
                                            if (title_u_gurume1[t1_index] > 0) has_power_g[_g_count + has_gurume_count++] = title_u_gurume1[t1_index];
                                            if (title_u_gurume2[t1_index] > 0) has_power_g[_g_count + has_gurume_count++] = title_u_gurume2[t1_index];
                                            if (equip_gurume1[e1_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume1[e1_index];
                                            if (equip_gurume2[e1_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume2[e1_index];
                                            if (equip_gurume1[e2_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume1[e2_index];
                                            if (equip_gurume2[e2_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume2[e2_index];
                                            if (equip_gurume1[e3_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume1[e3_index];

                                            let simple_count = 0;
                                            for (let g = 0; g < total_count_g; g++) {
                                                if (has_power_g[g] >= gurume_min && has_power_g[g] <= gurume_max) simple_count++;
                                            }
                                            if (setting_gurume_count > simple_count) continue;
                                            const loop_indices = new Int16Array(setting_gurume_count).fill(0);
                                            const selected_indices = new Int16Array(setting_gurume_count).fill(-1);
                                            const used = new Uint8Array(total_count_g).fill(0);

                                            let current_depth = 0;
                                            let gurume_check = 0;
                                            while (current_depth >= 0) {
                                                if (current_depth === setting_gurume_count) {
                                                    gurume_check = 1;
                                                    break;
                                                }
                                                const Min = setting_gurume_min[current_depth];
                                                const Max = setting_gurume_max[current_depth];
                                                let found = false;
                                                for (let i = loop_indices[current_depth]; i < total_count_g; i++) {
                                                    if (used[i] === 0) {
                                                        const val = has_power_g[i];
                                                        if (val >= Min && val <= Max) {
                                                            used[i] = 1;
                                                            selected_indices[current_depth] = i;
                                                            loop_indices[current_depth] = i + 1;
                                                            found = true;
                                                            break;
                                                        }
                                                    }
                                                }

                                                if (found) {
                                                    current_depth++;
                                                } else {
                                                    loop_indices[current_depth] = 0;
                                                    current_depth--;
                                                    if (current_depth >= 0) {
                                                        const prev_idx = selected_indices[current_depth];
                                                        used[prev_idx] = 0;
                                                    }
                                                }
                                            }
                                            if (gurume_check === 0) continue;
                                            let selected_g_index = 0;
                                            let selected_g_count = 0;
                                            if (setting_name[0] === 3 && setting_mode[0] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow1 = has_power_g[selected_g_index];
                                                e2_count1 = 1;
                                            }
                                            if (setting_name[1] === 3 && setting_mode[1] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow2 = has_power_g[selected_g_index];
                                                e2_count2 = 1;
                                            }
                                            if (setting_name[2] === 3 && setting_mode[2] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow3 = has_power_g[selected_g_index];
                                                e2_count3 = 1;
                                            }
                                            if (setting_name[3] === 3 && setting_mode[3] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow4 = has_power_g[selected_g_index];
                                                e2_count4 = 1;
                                            }
                                            if (setting_name[4] === 3 && setting_mode[4] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow5 = has_power_g[selected_g_index];
                                                e2_count5 = 1;
                                            }
                                            if (setting_name[5] === 3 && setting_mode[5] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow6 = has_power_g[selected_g_index];
                                                e2_count6 = 1;
                                            }
                                            if (setting_name[6] === 3 && setting_mode[6] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow7 = has_power_g[selected_g_index];
                                                e2_count7 = 1;
                                            }
                                            if (setting_name[7] === 3 && setting_mode[7] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow8 = has_power_g[selected_g_index];
                                                e2_count8 = 1;
                                            }
                                            if (setting_name[8] === 3 && setting_mode[8] === 1) {
                                                selected_g_index = selected_indices[selected_g_count++];
                                                e2_pow9 = has_power_g[selected_g_index];
                                                e2_count9 = 1;
                                            }
                                        }
                                        //#region
                                        if (setting_mode[0] === 1) {
                                            skillcheck = 0;
                                            if (e2_count1 === 0) continue;
                                            if (e2_pow1 === 0) { }
                                            else if (e2_pow1 < setting_min[0] || setting_max[0] < e2_pow1) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[1] === 1) {
                                            skillcheck = 0;
                                            if (e2_count2 === 0) continue;
                                            if (e2_pow2 === 0) { }
                                            else if (e2_pow2 < setting_min[1] || setting_max[1] < e2_pow2) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[2] === 1) {
                                            skillcheck = 0;
                                            if (e2_count3 === 0) continue;
                                            if (e2_pow3 === 0) { }
                                            else if (e2_pow3 < setting_min[2] || setting_max[2] < e2_pow3) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[3] === 1) {
                                            skillcheck = 0;
                                            if (e2_count4 === 0) continue;
                                            if (e2_pow4 === 0) { }
                                            else if (e2_pow4 < setting_min[3] || setting_max[3] < e2_pow4) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[4] === 1) {
                                            skillcheck = 0;
                                            if (e2_count5 === 0) continue;
                                            if (e2_pow5 === 0) { }
                                            else if (e2_pow5 < setting_min[4] || setting_max[4] < e2_pow5) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[5] === 1) {
                                            skillcheck = 0;
                                            if (e2_count6 === 0) continue;
                                            if (e2_pow6 === 0) { }
                                            else if (e2_pow6 < setting_min[5] || setting_max[5] < e2_pow6) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[6] === 1) {
                                            skillcheck = 0;
                                            if (e2_count7 === 0) continue;
                                            if (e2_pow7 === 0) { }
                                            else if (e2_pow7 < setting_min[6] || setting_max[6] < e2_pow7) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[7] === 1) {
                                            skillcheck = 0;
                                            if (e2_count8 === 0) continue;
                                            if (e2_pow8 === 0) { }
                                            else if (e2_pow8 < setting_min[7] || setting_max[7] < e2_pow8) continue;
                                            skillcheck = 1;
                                        }
                                        if (setting_mode[8] === 1) {
                                            skillcheck = 0;
                                            if (e2_count9 === 0) continue;
                                            if (e2_pow9 === 0) { }
                                            else if (e2_pow9 < setting_min[8] || setting_max[8] < e2_pow9) continue;
                                            skillcheck = 1;
                                        }
                                        if (skillcheck === 0) continue;
                                        //#endregion
                                        //#region
                                        if (can_or === 1) {
                                            skillcheck = 0;
                                            if (setting_mode[0] === 2 && setting_name[0] === 1) {
                                                if (e2_count1 > 0) {
                                                    if (e2_pow1 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow1 >= setting_min[0] && setting_max[0] >= e2_pow1) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count1 = 0;
                                                        e2_pow1 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[1] === 2 && setting_name[1] === 1) {
                                                if (e2_count2 > 0) {
                                                    if (e2_pow2 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow2 >= setting_min[1] && setting_max[1] >= e2_pow2) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count2 = 0;
                                                        e2_pow2 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[2] === 2 && setting_name[2] === 1) {
                                                if (e2_count3 > 0) {
                                                    if (e2_pow3 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow3 >= setting_min[2] && setting_max[2] >= e2_pow3) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count3 = 0;
                                                        e2_pow3 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[3] === 2 && setting_name[3] === 1) {
                                                if (e2_count4 > 0) {
                                                    if (e2_pow4 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow4 >= setting_min[3] && setting_max[3] >= e2_pow4) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count4 = 0;
                                                        e2_pow4 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[4] === 2 && setting_name[4] === 1) {
                                                if (e2_count5 > 0) {
                                                    if (e2_pow5 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow5 >= setting_min[4] && setting_max[4] >= e2_pow5) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count5 = 0;
                                                        e2_pow5 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[5] === 2 && setting_name[5] === 1) {
                                                if (e2_count6 > 0) {
                                                    if (e2_pow6 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow6 >= setting_min[5] && setting_max[5] >= e2_pow6) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count6 = 0;
                                                        e2_pow6 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[6] === 2 && setting_name[6] === 1) {
                                                if (e2_count7 > 0) {
                                                    if (e2_pow7 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow7 >= setting_min[6] && setting_max[6] >= e2_pow7) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count7 = 0;
                                                        e2_pow7 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[7] === 2 && setting_name[7] === 1) {
                                                if (e2_count8 > 0) {
                                                    if (e2_pow8 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow8 >= setting_min[7] && setting_max[7] >= e2_pow8) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count8 = 0;
                                                        e2_pow8 = 0;
                                                    }
                                                }
                                            }
                                            if (setting_mode[8] === 2 && setting_name[8] === 1) {
                                                if (e2_count9 > 0) {
                                                    if (e2_pow9 === 0) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else if (e2_pow9 >= setting_min[8] && setting_max[8] >= e2_pow9) {
                                                        if (skillcheck === 1) continue;
                                                        else skillcheck = 1;
                                                    }
                                                    else {
                                                        e2_count9 = 0;
                                                        e2_pow9 = 0;
                                                    }
                                                }
                                            }
                                            if (skillcheck === 0) continue;
                                        }
                                        //#endregion

                                        u16[idx++] = unique_number[u];
                                        u16[idx++] = title_u_number[t1_index];
                                        u16[idx++] = 0;
                                        u16[idx++] = equip_number[e1_index];
                                        u16[idx++] = equip_number[e2_index];
                                        u16[idx++] = equip_number[e3_index];
                                        u16[idx++] = e2_count1;
                                        u16[idx++] = e2_count2;
                                        u16[idx++] = e2_count3;
                                        u16[idx++] = e2_count4;
                                        u16[idx++] = e2_count5;
                                        u16[idx++] = e2_count6;
                                        u16[idx++] = e2_count7;
                                        u16[idx++] = e2_count8;
                                        u16[idx++] = e2_count9;
                                        u16[idx++] = e2_pow1;
                                        u16[idx++] = e2_pow2;
                                        u16[idx++] = e2_pow3;
                                        u16[idx++] = e2_pow4;
                                        u16[idx++] = e2_pow5;
                                        u16[idx++] = e2_pow6;
                                        u16[idx++] = e2_pow7;
                                        u16[idx++] = e2_pow8;
                                        u16[idx++] = e2_pow9;
                                        list_count++;

                                        if (list_count > list_limit) {
                                            self.postMessage({ action: "cancelled", payload: 2 });
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
        if (is_common === 1) {

            //#region
            const common_number = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Number));
            const common_kago1 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Kago1));
            const common_kago2 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Kago2));
            const common_slay = new Uint32Array(inputData.Sim_Unit_C.map(item => item.Slay));
            const common_growth = new Uint16Array(inputData.Sim_Unit_C.map(item => item.GrowthRank));
            const common_equip1 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.CategoryEquip1));
            const common_equip2 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.CategoryEquip2));
            const common_leader_torehan = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Leader_Torehan));
            const common_p1 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow1));
            const common_p2 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow2));
            const common_p3 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow3));
            const common_p4 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow4));
            const common_p5 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow5));
            const common_p6 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow6));
            const common_p7 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow7));
            const common_p8 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow8));
            const common_p9 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Pow9));
            const common_c1 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count1));
            const common_c2 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count2));
            const common_c3 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count3));
            const common_c4 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count4));
            const common_c5 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count5));
            const common_c6 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count6));
            const common_c7 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count7));
            const common_c8 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count8));
            const common_c9 = new Uint16Array(inputData.Sim_Unit_C.map(item => item.Skill_Count9));
            //#endregion
            const gekiha_c_count = new Uint16Array(inputData.Gekiha_Count_C);
            const gekiha_c_offset = new Uint16Array(inputData.Gekiha_Offset_C);
            const gekiha_c_values = new Uint16Array(inputData.Gekiha_Values_C);
            const gurume_c_count = new Uint16Array(inputData.Gurume_Count_C);
            const gurume_c_offset = new Uint16Array(inputData.Gurume_Offset_C);
            const gurume_c_values = new Uint16Array(inputData.Gurume_Values_C);
            //#region
            const title_pre_number = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Number));
            const title_pre_rank = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Rank));
            const title_pre_kago1 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.TitleKago1));
            const title_pre_slay1 = new Uint32Array(inputData.Sim_Title_C1.map(item => item.TitleSlay1));
            const title_pre_gekiha1 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Gekiha1));
            const title_pre_gurume1 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Gurume1));
            const title_c_pre_p1 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow1));
            const title_c_pre_p2 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow2));
            const title_c_pre_p3 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow3));
            const title_c_pre_p4 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow4));
            const title_c_pre_p5 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow5));
            const title_c_pre_p6 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow6));
            const title_c_pre_p7 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow7));
            const title_c_pre_p8 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow8));
            const title_c_pre_p9 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Pow9));

            const title_c_pre_c1 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count1));
            const title_c_pre_c2 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count2));
            const title_c_pre_c3 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count3));
            const title_c_pre_c4 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count4));
            const title_c_pre_c5 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count5));
            const title_c_pre_c6 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count6));
            const title_c_pre_c7 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count7));
            const title_c_pre_c8 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count8));
            const title_c_pre_c9 = new Uint16Array(inputData.Sim_Title_C1.map(item => item.Skill_Count9));
            const title_suf_number = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Number));
            const title_suf_rank = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Rank));
            const title_suf_kago2 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.TitleKago2));
            const title_suf_slay2 = new Uint32Array(inputData.Sim_Title_C2.map(item => item.TitleSlay2));
            const title_suf_gekiha2 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Gekiha2));
            const title_suf_gurume2 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Gurume2));
            const title_c_suf_p1 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow1));
            const title_c_suf_p2 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow2));
            const title_c_suf_p3 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow3));
            const title_c_suf_p4 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow4));
            const title_c_suf_p5 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow5));
            const title_c_suf_p6 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow6));
            const title_c_suf_p7 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow7));
            const title_c_suf_p8 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow8));
            const title_c_suf_p9 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Pow9));
            const title_c_suf_c1 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count1));
            const title_c_suf_c2 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count2));
            const title_c_suf_c3 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count3));
            const title_c_suf_c4 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count4));
            const title_c_suf_c5 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count5));
            const title_c_suf_c6 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count6));
            const title_c_suf_c7 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count7));
            const title_c_suf_c8 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count8));
            const title_c_suf_c9 = new Uint16Array(inputData.Sim_Title_C2.map(item => item.Skill_Count9));
            const t_count_pre = title_pre_number.length;
            const t_count_suf = title_suf_number.length;
            const t_match1 = new Uint32Array(t_count_pre);
            const t_match2 = new Uint32Array(t_count_suf);
            //#endregion
            const u_count = common_number.length;

            let gg_unit = [];
            if (gekiha_reject > 0) {
                let gg_and = 0;
                for (let ss = 0; ss < 9; ss++) {
                    if (setting_name[ss] === 2) {
                        if (setting_mode[ss] === 1) {
                            gg_and = 1;
                            break;
                        }
                    }
                }
                if (gg_and === 0) {
                    for (let gg = 0; gg < u_count; gg++) {
                        if (gekiha_c_count[gg] > 0) {
                            gg_unit.push(gg);
                        }
                    }
                }
            }
            if (gurume_reject > 0) {
                let gg_and = 0;
                for (let ss = 0; ss < 9; ss++) {
                    if (setting_name[ss] === 3) {
                        if (setting_mode[ss] === 1) {
                            gg_and = 1;
                            break;
                        }
                    }
                }
                if (gg_and === 0) {
                    for (let gg = 0; gg < u_count; gg++) {
                        if (gurume_c_count[gg] > 0) {
                            gg_unit.push(gg);
                        }
                    }
                }
            }
            for (let u = 0; u < u_count; u++) {
                await new Promise(resolve => setTimeout(resolve, 1));
                counter++;
                self.postMessage({ action: "progress", payload: counter });
                //#region
                if (setting_mode[0] === 4 && (common_c1[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[1] === 4 && (common_c2[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[2] === 4 && (common_c3[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[3] === 4 && (common_c4[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[4] === 4 && (common_c5[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[5] === 4 && (common_c6[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[6] === 4 && (common_c7[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[7] === 4 && (common_c8[u] === 1 || gg_unit.includes(u))) continue;
                if (setting_mode[8] === 4 && (common_c9[u] === 1 || gg_unit.includes(u))) continue;
                //#endregion
                //#region
                const u_rank = common_growth[u];
                let t_count1 = 0;
                let t_count2 = 0;
                for (let t = 0; t < t_count_pre; t++) {
                    if (u_rank < title_pre_rank[t]) continue;
                    t_match1[t_count1++] = t;
                }
                for (let t = 0; t < t_count_suf; t++) {
                    if (u_rank < title_suf_rank[t]) continue;
                    t_match2[t_count2++] = t;
                }
                //#endregion
                //#region
                const e_type1 = common_equip1[u];
                const e_type2 = common_equip2[u];
                for (let bit1 = 0; bit1 < 14; bit1++) {
                    if ((e_type1 & (1 << bit1)) === 0) continue;
                    const e_match1 = itemBuckets[bit1];
                    for (let bit2 = 0; bit2 < 14; bit2++) {
                        if ((e_type2 & (1 << bit2)) === 0) continue;
                        const e_match2 = itemBuckets[bit2];
                        const e_match3 = itemBuckets[13];
                        //#endregion
                        for (let t1 = 0; t1 < t_count1; t1++) {
                            const t1_index = t_match1[t1];
                            //#region
                            const t1_pow1 = common_p1[u] + title_c_pre_p1[t1_index];
                            const t1_pow2 = common_p2[u] + title_c_pre_p2[t1_index];
                            const t1_pow3 = common_p3[u] + title_c_pre_p3[t1_index];
                            const t1_pow4 = common_p4[u] + title_c_pre_p4[t1_index];
                            const t1_pow5 = common_p5[u] + title_c_pre_p5[t1_index];
                            const t1_pow6 = common_p6[u] + title_c_pre_p6[t1_index];
                            const t1_pow7 = common_p7[u] + title_c_pre_p7[t1_index];
                            const t1_pow8 = common_p8[u] + title_c_pre_p8[t1_index];
                            const t1_pow9 = common_p9[u] + title_c_pre_p9[t1_index];
                            const t1_count1 = common_c1[u] + title_c_pre_c1[t1_index];
                            const t1_count2 = common_c2[u] + title_c_pre_c2[t1_index];
                            const t1_count3 = common_c3[u] + title_c_pre_c3[t1_index];
                            const t1_count4 = common_c4[u] + title_c_pre_c4[t1_index];
                            const t1_count5 = common_c5[u] + title_c_pre_c5[t1_index];
                            const t1_count6 = common_c6[u] + title_c_pre_c6[t1_index];
                            const t1_count7 = common_c7[u] + title_c_pre_c7[t1_index];
                            const t1_count8 = common_c8[u] + title_c_pre_c8[t1_index];
                            const t1_count9 = common_c9[u] + title_c_pre_c9[t1_index];
                            //#endregion
                            for (let t2 = 0; t2 < t_count2; t2++) {
                                const t2_index = t_match2[t2];
                                //#region
                                const t2_pow1 = t1_pow1 + title_c_suf_p1[t2_index];
                                const t2_pow2 = t1_pow2 + title_c_suf_p2[t2_index];
                                const t2_pow3 = t1_pow3 + title_c_suf_p3[t2_index];
                                const t2_pow4 = t1_pow4 + title_c_suf_p4[t2_index];
                                const t2_pow5 = t1_pow5 + title_c_suf_p5[t2_index];
                                const t2_pow6 = t1_pow6 + title_c_suf_p6[t2_index];
                                const t2_pow7 = t1_pow7 + title_c_suf_p7[t2_index];
                                const t2_pow8 = t1_pow8 + title_c_suf_p8[t2_index];
                                const t2_pow9 = t1_pow9 + title_c_suf_p9[t2_index];
                                const t2_count1 = t1_count1 + title_c_suf_c1[t2_index];
                                const t2_count2 = t1_count2 + title_c_suf_c2[t2_index];
                                const t2_count3 = t1_count3 + title_c_suf_c3[t2_index];
                                const t2_count4 = t1_count4 + title_c_suf_c4[t2_index];
                                const t2_count5 = t1_count5 + title_c_suf_c5[t2_index];
                                const t2_count6 = t1_count6 + title_c_suf_c6[t2_index];
                                const t2_count7 = t1_count7 + title_c_suf_c7[t2_index];
                                const t2_count8 = t1_count8 + title_c_suf_c8[t2_index];
                                const t2_count9 = t1_count9 + title_c_suf_c9[t2_index];
                                //#endregion
                                //#region
                                if (t2_pow1 === 0 && t2_count1 > 1) continue;
                                if (t2_pow2 === 0 && t2_count2 > 1) continue;
                                if (t2_pow3 === 0 && t2_count3 > 1) continue;
                                if (t2_pow4 === 0 && t2_count4 > 1) continue;
                                if (t2_pow5 === 0 && t2_count5 > 1) continue;
                                if (t2_pow6 === 0 && t2_count6 > 1) continue;
                                if (t2_pow7 === 0 && t2_count7 > 1) continue;
                                if (t2_pow8 === 0 && t2_count8 > 1) continue;
                                if (t2_pow9 === 0 && t2_count9 > 1) continue;
                                //#endregion
                                //#region
                                if (filter_kago > 0) {
                                    let bit_kago = 0;
                                    if (title_pre_kago1[t1_index] > 0) {
                                        bit_kago |= title_pre_kago1[t1_index];
                                    }
                                    else {
                                        bit_kago |= common_kago1[u];
                                    }
                                    if (title_suf_kago2[t2_index] > 0) {
                                        bit_kago |= title_suf_kago2[t2_index];
                                    }
                                    else {
                                        if (common_kago2[u] > 0) {
                                            bit_kago |= common_kago2[u];
                                        }
                                    }
                                    if (filter_kago_or === 1) {
                                        if ((bit_kago & filter_kago) === 0) continue;
                                    }
                                    else {
                                        if ((bit_kago & filter_kago) !== filter_kago) continue;
                                    }
                                }
                                //#endregion
                                for (let e1 = 0; e1 < e_match1.length; e1++) {
                                    const e1_index = e_match1[e1];
                                    //#region
                                    const e1_pow1 = t2_pow1 + equip_p1[e1_index];
                                    const e1_pow2 = t2_pow2 + equip_p2[e1_index];
                                    const e1_pow3 = t2_pow3 + equip_p3[e1_index];
                                    const e1_pow4 = t2_pow4 + equip_p4[e1_index];
                                    const e1_pow5 = t2_pow5 + equip_p5[e1_index];
                                    const e1_pow6 = t2_pow6 + equip_p6[e1_index];
                                    const e1_pow7 = t2_pow7 + equip_p7[e1_index];
                                    const e1_pow8 = t2_pow8 + equip_p8[e1_index];
                                    const e1_pow9 = t2_pow9 + equip_p9[e1_index];
                                    const e1_count1 = t2_count1 + equip_c1[e1_index];
                                    const e1_count2 = t2_count2 + equip_c2[e1_index];
                                    const e1_count3 = t2_count3 + equip_c3[e1_index];
                                    const e1_count4 = t2_count4 + equip_c4[e1_index];
                                    const e1_count5 = t2_count5 + equip_c5[e1_index];
                                    const e1_count6 = t2_count6 + equip_c6[e1_index];
                                    const e1_count7 = t2_count7 + equip_c7[e1_index];
                                    const e1_count8 = t2_count8 + equip_c8[e1_index];
                                    const e1_count9 = t2_count9 + equip_c9[e1_index];
                                    //#endregion
                                    for (let e2 = 0; e2 < e_match2.length; e2++) {
                                        const e2_index = e_match2[e2];
                                        //#region
                                        if (filter_slay > 0) {
                                            let bit_slay = common_slay[u] | title_pre_slay1[t1_index] | title_suf_slay2[t2_index] |
                                                equip_slay1[e1_index] | equip_slay2[e1_index] | equip_slay1[e2_index] | equip_slay2[e2_index];
                                            if (filter_slay_or === 1) {
                                                if ((bit_slay & filter_slay) === 0) continue;
                                            }
                                            else {
                                                if (filter_slay === 4194304) {
                                                    if (bit_slay !== 4194304) continue;
                                                }
                                                else if ((bit_slay & filter_slay) !== filter_slay) continue;
                                            }
                                        }
                                        //#endregion
                                        for (let e3 = 0; e3 < e_match3.length; e3++) {
                                            const e3_index = e_match3[e3];

                                            //#region
                                            let skillcheck = 0;
                                            let e2_pow1 = e1_pow1 + equip_p1[e2_index] + equip_p1[e3_index];
                                            let e2_pow2 = e1_pow2 + equip_p2[e2_index] + equip_p2[e3_index];
                                            let e2_pow3 = e1_pow3 + equip_p3[e2_index] + equip_p3[e3_index];
                                            let e2_pow4 = e1_pow4 + equip_p4[e2_index] + equip_p4[e3_index];
                                            let e2_pow5 = e1_pow5 + equip_p5[e2_index] + equip_p5[e3_index];
                                            let e2_pow6 = e1_pow6 + equip_p6[e2_index] + equip_p6[e3_index];
                                            let e2_pow7 = e1_pow7 + equip_p7[e2_index] + equip_p7[e3_index];
                                            let e2_pow8 = e1_pow8 + equip_p8[e2_index] + equip_p8[e3_index];
                                            let e2_pow9 = e1_pow9 + equip_p9[e2_index] + equip_p9[e3_index];
                                            let e2_count1 = e1_count1 + equip_c1[e2_index] + equip_c1[e3_index];
                                            let e2_count2 = e1_count2 + equip_c2[e2_index] + equip_c2[e3_index];
                                            let e2_count3 = e1_count3 + equip_c3[e2_index] + equip_c3[e3_index];
                                            let e2_count4 = e1_count4 + equip_c4[e2_index] + equip_c4[e3_index];
                                            let e2_count5 = e1_count5 + equip_c5[e2_index] + equip_c5[e3_index];
                                            let e2_count6 = e1_count6 + equip_c6[e2_index] + equip_c6[e3_index];
                                            let e2_count7 = e1_count7 + equip_c7[e2_index] + equip_c7[e3_index];
                                            let e2_count8 = e1_count8 + equip_c8[e2_index] + equip_c8[e3_index];
                                            let e2_count9 = e1_count9 + equip_c9[e2_index] + equip_c9[e3_index];
                                            //#endregion
                                            if (has_gekiha === 1) {
                                                const _g_count = gekiha_c_count[u];
                                                const _g_offset = gekiha_c_offset[u];
                                                let has_gekiha_count = 0;
                                                if (title_pre_gekiha1[t1_index] > 0) has_gekiha_count++;
                                                if (title_suf_gekiha2[t2_index] > 0) has_gekiha_count++;
                                                if (equip_gekiha1[e1_index] > 0) has_gekiha_count++;
                                                if (equip_gekiha2[e1_index] > 0) has_gekiha_count++;
                                                if (equip_gekiha1[e2_index] > 0) has_gekiha_count++;
                                                if (equip_gekiha2[e2_index] > 0) has_gekiha_count++;
                                                if (equip_gekiha1[e3_index] > 0) has_gekiha_count++;
                                                const total_count_g = _g_count + has_gekiha_count;
                                                if (total_count_g === 0 || total_count_g < setting_gekiha_count) continue;

                                                const has_power_g = new Uint16Array(total_count_g);
                                                for (let g = 0; g < _g_count; g++) {
                                                    has_power_g[g] = gekiha_c_values[g + _g_offset];
                                                }
                                                has_gekiha_count = 0;
                                                if (title_pre_gekiha1[t1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = title_pre_gekiha1[t1_index];
                                                if (title_suf_gekiha2[t2_index] > 0) has_power_g[_g_count + has_gekiha_count++] = title_suf_gekiha2[t2_index];
                                                if (equip_gekiha1[e1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha1[e1_index];
                                                if (equip_gekiha2[e1_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha2[e1_index];
                                                if (equip_gekiha1[e2_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha1[e2_index];
                                                if (equip_gekiha2[e2_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha2[e2_index];
                                                if (equip_gekiha1[e3_index] > 0) has_power_g[_g_count + has_gekiha_count++] = equip_gekiha1[e3_index];

                                                let simple_count = 0;
                                                for (let g = 0; g < total_count_g; g++) {
                                                    if (has_power_g[g] >= gekiha_min && has_power_g[g] <= gekiha_max) simple_count++;
                                                }
                                                if (setting_gekiha_count > simple_count) continue;
                                                const loop_indices = new Int16Array(setting_gekiha_count).fill(0);
                                                const selected_indices = new Int16Array(setting_gekiha_count).fill(-1);
                                                const used = new Uint8Array(total_count_g).fill(0);

                                                let current_depth = 0;
                                                let gekiha_check = 0;
                                                while (current_depth >= 0) {
                                                    if (current_depth === setting_gekiha_count) {
                                                        gekiha_check = 1;
                                                        break;
                                                    }
                                                    const Min = setting_gekiha_min[current_depth];
                                                    const Max = setting_gekiha_max[current_depth];
                                                    let found = false;
                                                    for (let i = loop_indices[current_depth]; i < total_count_g; i++) {
                                                        if (used[i] === 0) {
                                                            const val = has_power_g[i];
                                                            if (val >= Min && val <= Max) {
                                                                used[i] = 1;
                                                                selected_indices[current_depth] = i;
                                                                loop_indices[current_depth] = i + 1;
                                                                found = true;
                                                                break;
                                                            }
                                                        }
                                                    }

                                                    if (found) {
                                                        current_depth++;
                                                    } else {
                                                        loop_indices[current_depth] = 0;
                                                        current_depth--;
                                                        if (current_depth >= 0) {
                                                            const prev_idx = selected_indices[current_depth];
                                                            used[prev_idx] = 0;
                                                        }
                                                    }
                                                }
                                                if (gekiha_check === 0) continue;
                                                let selected_g_index = 0;
                                                let selected_g_count = 0;
                                                if (setting_name[0] === 2 && setting_mode[0] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow1 = has_power_g[selected_g_index];
                                                    e2_count1 = 1;
                                                }
                                                if (setting_name[1] === 2 && setting_mode[1] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow2 = has_power_g[selected_g_index];
                                                    e2_count2 = 1;
                                                }
                                                if (setting_name[2] === 2 && setting_mode[2] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow3 = has_power_g[selected_g_index];
                                                    e2_count3 = 1;
                                                }
                                                if (setting_name[3] === 2 && setting_mode[3] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow4 = has_power_g[selected_g_index];
                                                    e2_count4 = 1;
                                                }
                                                if (setting_name[4] === 2 && setting_mode[4] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow5 = has_power_g[selected_g_index];
                                                    e2_count5 = 1;
                                                }
                                                if (setting_name[5] === 2 && setting_mode[5] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow6 = has_power_g[selected_g_index];
                                                    e2_count6 = 1;
                                                }
                                                if (setting_name[6] === 2 && setting_mode[6] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow7 = has_power_g[selected_g_index];
                                                    e2_count7 = 1;
                                                }
                                                if (setting_name[7] === 2 && setting_mode[7] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow8 = has_power_g[selected_g_index];
                                                    e2_count8 = 1;
                                                }
                                                if (setting_name[8] === 2 && setting_mode[8] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow9 = has_power_g[selected_g_index];
                                                    e2_count9 = 1;
                                                }
                                            }

                                            if (has_gurume === 1) {
                                                const _g_count = gurume_c_count[u];
                                                const _g_offset = gurume_c_offset[u];
                                                let has_gurume_count = 0;
                                                if (title_pre_gurume1[t1_index] > 0) has_gurume_count++;
                                                if (title_suf_gurume2[t2_index] > 0) has_gurume_count++;
                                                if (equip_gurume1[e1_index] > 0) has_gurume_count++;
                                                if (equip_gurume2[e1_index] > 0) has_gurume_count++;
                                                if (equip_gurume1[e2_index] > 0) has_gurume_count++;
                                                if (equip_gurume2[e2_index] > 0) has_gurume_count++;
                                                if (equip_gurume1[e3_index] > 0) has_gurume_count++;

                                                const total_count_g = _g_count + has_gurume_count;
                                                if (total_count_g === 0 || total_count_g < setting_gurume_count) continue;

                                                const has_power_g = new Uint16Array(total_count_g);
                                                for (let g = 0; g < _g_count; g++) {
                                                    has_power_g[g] = gurume_c_values[g + _g_offset];
                                                }
                                                has_gurume_count = 0;
                                                if (title_pre_gurume1[t1_index] > 0) has_power_g[_g_count + has_gurume_count++] = title_pre_gurume1[t1_index];
                                                if (title_suf_gurume2[t2_index] > 0) has_power_g[_g_count + has_gurume_count++] = title_suf_gurume2[t2_index];
                                                if (equip_gurume1[e1_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume1[e1_index];
                                                if (equip_gurume2[e1_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume2[e1_index];
                                                if (equip_gurume1[e2_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume1[e2_index];
                                                if (equip_gurume2[e2_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume2[e2_index];
                                                if (equip_gurume1[e3_index] > 0) has_power_g[_g_count + has_gurume_count++] = equip_gurume1[e3_index];

                                                let simple_count = 0;
                                                for (let g = 0; g < total_count_g; g++) {
                                                    if (has_power_g[g] >= gurume_min && has_power_g[g] <= gurume_max) simple_count++;
                                                }
                                                if (setting_gurume_count > simple_count) continue;
                                                const loop_indices = new Int16Array(setting_gurume_count).fill(0);
                                                const selected_indices = new Int16Array(setting_gurume_count).fill(-1);
                                                const used = new Uint8Array(total_count_g).fill(0);

                                                let current_depth = 0;
                                                let gurume_check = 0;
                                                while (current_depth >= 0) {
                                                    if (current_depth === setting_gurume_count) {
                                                        gurume_check = 1;
                                                        break;
                                                    }
                                                    const Min = setting_gurume_min[current_depth];
                                                    const Max = setting_gurume_max[current_depth];
                                                    let found = false;
                                                    for (let i = loop_indices[current_depth]; i < total_count_g; i++) {
                                                        if (used[i] === 0) {
                                                            const val = has_power_g[i];
                                                            if (val >= Min && val <= Max) {
                                                                used[i] = 1;
                                                                selected_indices[current_depth] = i;
                                                                loop_indices[current_depth] = i + 1;
                                                                found = true;
                                                                break;
                                                            }
                                                        }
                                                    }

                                                    if (found) {
                                                        current_depth++;
                                                    } else {
                                                        loop_indices[current_depth] = 0;
                                                        current_depth--;
                                                        if (current_depth >= 0) {
                                                            const prev_idx = selected_indices[current_depth];
                                                            used[prev_idx] = 0;
                                                        }
                                                    }
                                                }
                                                if (gurume_check === 0) continue;
                                                let selected_g_index = 0;
                                                let selected_g_count = 0;
                                                if (setting_name[0] === 3 && setting_mode[0] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow1 = has_power_g[selected_g_index];
                                                    e2_count1 = 1;
                                                }
                                                if (setting_name[1] === 3 && setting_mode[1] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow2 = has_power_g[selected_g_index];
                                                    e2_count2 = 1;
                                                }
                                                if (setting_name[2] === 3 && setting_mode[2] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow3 = has_power_g[selected_g_index];
                                                    e2_count3 = 1;
                                                }
                                                if (setting_name[3] === 3 && setting_mode[3] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow4 = has_power_g[selected_g_index];
                                                    e2_count4 = 1;
                                                }
                                                if (setting_name[4] === 3 && setting_mode[4] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow5 = has_power_g[selected_g_index];
                                                    e2_count5 = 1;
                                                }
                                                if (setting_name[5] === 3 && setting_mode[5] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow6 = has_power_g[selected_g_index];
                                                    e2_count6 = 1;
                                                }
                                                if (setting_name[6] === 3 && setting_mode[6] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow7 = has_power_g[selected_g_index];
                                                    e2_count7 = 1;
                                                }
                                                if (setting_name[7] === 3 && setting_mode[7] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow8 = has_power_g[selected_g_index];
                                                    e2_count8 = 1;
                                                }
                                                if (setting_name[8] === 3 && setting_mode[8] === 1) {
                                                    selected_g_index = selected_indices[selected_g_count++];
                                                    e2_pow9 = has_power_g[selected_g_index];
                                                    e2_count9 = 1;
                                                }
                                            }
                                            skillcheck = 1;
                                            //#region
                                            if (setting_mode[0] === 1) {
                                                skillcheck = 0;
                                                if (e2_count1 === 0) continue;
                                                if (e2_pow1 === 0) { }
                                                else if (e2_pow1 < setting_min[0] || setting_max[0] < e2_pow1) continue;
                                                skillcheck = 1;
                                            }
                                            if (setting_mode[1] === 1) {
                                                skillcheck = 0;
                                                if (e2_count2 === 0) continue;
                                                if (e2_pow2 === 0) { }
                                                else if (e2_pow2 < setting_min[1] || setting_max[1] < e2_pow2) continue;
                                                skillcheck = 1;
                                            }
                                            if (setting_mode[2] === 1) {
                                                skillcheck = 0;
                                                if (e2_count3 === 0) continue;
                                                if (e2_pow3 === 0) { }
                                                else if (e2_pow3 < setting_min[2] || setting_max[2] < e2_pow3) continue;
                                                skillcheck = 1;
                                            }
                                            if (setting_mode[3] === 1) {
                                                skillcheck = 0;
                                                if (e2_count4 === 0) continue;
                                                if (e2_pow4 === 0) { }
                                                else if (e2_pow4 < setting_min[3] || setting_max[3] < e2_pow4) continue;
                                                skillcheck = 1;
                                            }
                                            if (setting_mode[4] === 1) {
                                                skillcheck = 0;
                                                if (e2_count5 === 0) continue;
                                                if (e2_pow5 === 0) { }
                                                else if (e2_pow5 < setting_min[4] || setting_max[4] < e2_pow5) continue;
                                                skillcheck = 1;
                                            }
                                            if (setting_mode[5] === 1) {
                                                skillcheck = 0;
                                                if (e2_count6 === 0) continue;
                                                if (e2_pow6 === 0) { }
                                                else if (e2_pow6 < setting_min[5] || setting_max[5] < e2_pow6) continue;
                                                skillcheck = 1;
                                            }
                                            if (setting_mode[6] === 1) {
                                                skillcheck = 0;
                                                if (e2_count7 === 0) continue;
                                                if (e2_pow7 === 0) { }
                                                else if (e2_pow7 < setting_min[6] || setting_max[6] < e2_pow7) continue;
                                                skillcheck = 1;
                                            }
                                            if (setting_mode[7] === 1) {
                                                skillcheck = 0;
                                                if (e2_count8 === 0) continue;
                                                if (e2_pow8 === 0) { }
                                                else if (e2_pow8 < setting_min[7] || setting_max[7] < e2_pow8) continue;
                                                skillcheck = 1;
                                            }
                                            if (setting_mode[8] === 1) {
                                                skillcheck = 0;
                                                if (e2_count9 === 0) continue;
                                                if (e2_pow9 === 0) { }
                                                else if (e2_pow9 < setting_min[8] || setting_max[8] < e2_pow9) continue;
                                                skillcheck = 1;
                                            }
                                            if (skillcheck === 0) continue;
                                            //#endregion
                                            //#region
                                            if (can_or === 1) {
                                                skillcheck = 0;
                                                if (setting_mode[0] === 2 && setting_name[0] === 1) {
                                                    if (e2_count1 > 0) {
                                                        if (e2_pow1 === 0) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else if (e2_pow1 >= setting_min[0] && setting_max[0] >= e2_pow1) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else {
                                                            e2_count1 = 0;
                                                            e2_pow1 = 0;
                                                        }
                                                    }
                                                }
                                                if (setting_mode[1] === 2 && setting_name[1] === 1) {
                                                    if (e2_count2 > 0) {
                                                        if (e2_pow2 === 0) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else if (e2_pow2 >= setting_min[1] && setting_max[1] >= e2_pow2) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else {
                                                            e2_count2 = 0;
                                                            e2_pow2 = 0;
                                                        }
                                                    }
                                                }
                                                if (setting_mode[2] === 2 && setting_name[2] === 1) {
                                                    if (e2_count3 > 0) {
                                                        if (e2_pow3 === 0) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else if (e2_pow3 >= setting_min[2] && setting_max[2] >= e2_pow3) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else {
                                                            e2_count3 = 0;
                                                            e2_pow3 = 0;
                                                        }
                                                    }
                                                }
                                                if (setting_mode[3] === 2 && setting_name[3] === 1) {
                                                    if (e2_count4 > 0) {
                                                        if (e2_pow4 === 0) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else if (e2_pow4 >= setting_min[3] && setting_max[3] >= e2_pow4) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else {
                                                            e2_count4 = 0;
                                                            e2_pow4 = 0;
                                                        }
                                                    }
                                                }
                                                if (setting_mode[4] === 2 && setting_name[4] === 1) {
                                                    if (e2_count5 > 0) {
                                                        if (e2_pow5 === 0) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else if (e2_pow5 >= setting_min[4] && setting_max[4] >= e2_pow5) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else {
                                                            e2_count5 = 0;
                                                            e2_pow5 = 0;
                                                        }
                                                    }
                                                }
                                                if (setting_mode[5] === 2 && setting_name[5] === 1) {
                                                    if (e2_count6 > 0) {
                                                        if (e2_pow6 === 0) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else if (e2_pow6 >= setting_min[5] && setting_max[5] >= e2_pow6) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else {
                                                            e2_count6 = 0;
                                                            e2_pow6 = 0;
                                                        }
                                                    }
                                                }
                                                if (setting_mode[6] === 2 && setting_name[6] === 1) {
                                                    if (e2_count7 > 0) {
                                                        if (e2_pow7 === 0) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else if (e2_pow7 >= setting_min[6] && setting_max[6] >= e2_pow7) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else {
                                                            e2_count7 = 0;
                                                            e2_pow7 = 0;
                                                        }
                                                    }
                                                }
                                                if (setting_mode[7] === 2 && setting_name[7] === 1) {
                                                    if (e2_count8 > 0) {
                                                        if (e2_pow8 === 0) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else if (e2_pow8 >= setting_min[7] && setting_max[7] >= e2_pow8) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else {
                                                            e2_count8 = 0;
                                                            e2_pow8 = 0;
                                                        }
                                                    }
                                                }
                                                if (setting_mode[8] === 2 && setting_name[8] === 1) {
                                                    if (e2_count9 > 0) {
                                                        if (e2_pow9 === 0) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else if (e2_pow9 >= setting_min[8] && setting_max[8] >= e2_pow9) {
                                                            if (skillcheck === 1) continue;
                                                            else skillcheck = 1;
                                                        }
                                                        else {
                                                            e2_count9 = 0;
                                                            e2_pow9 = 0;
                                                        }
                                                    }
                                                }
                                                if (skillcheck === 0) continue;
                                            }
                                            //#endregion

                                            u16[idx++] = common_number[u];
                                            u16[idx++] = title_pre_number[t1_index];
                                            u16[idx++] = title_suf_number[t2_index];
                                            u16[idx++] = equip_number[e1_index];
                                            u16[idx++] = equip_number[e2_index];
                                            u16[idx++] = equip_number[e3_index];
                                            u16[idx++] = e2_count1;
                                            u16[idx++] = e2_count2;
                                            u16[idx++] = e2_count3;
                                            u16[idx++] = e2_count4;
                                            u16[idx++] = e2_count5;
                                            u16[idx++] = e2_count6;
                                            u16[idx++] = e2_count7;
                                            u16[idx++] = e2_count8;
                                            u16[idx++] = e2_count9;
                                            u16[idx++] = e2_pow1;
                                            u16[idx++] = e2_pow2;
                                            u16[idx++] = e2_pow3;
                                            u16[idx++] = e2_pow4;
                                            u16[idx++] = e2_pow5;
                                            u16[idx++] = e2_pow6;
                                            u16[idx++] = e2_pow7;
                                            u16[idx++] = e2_pow8;
                                            u16[idx++] = e2_pow9;

                                            list_count++;

                                            if (list_count > list_limit) {
                                                self.postMessage({ action: "cancelled", payload: 2 });
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

        await new Promise(resolve => setTimeout(resolve, 1));
        self.postMessage({ action: 'preresult', payload: 1 });
        await new Promise(resolve => setTimeout(resolve, 1));
        const resultBuffer = u16.buffer.slice(0, idx * 2);
        self.postMessage({ action: "result", payload: resultBuffer }, [resultBuffer]);
    }
}

self.onerror = function (e) {
    self.postMessage({
        action: 'error',
        payload: 'Unknown worker error'
    });
};
