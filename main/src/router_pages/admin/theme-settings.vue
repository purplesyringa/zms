<template>
	<div class="theme-settings">
		<h1>Theme settings</h1>

		<div v-for="setting in settings">
			<h2 v-if="setting.heading">{{setting.heading}}</h2>

			<named-input
				v-else-if="setting.type === 'string'"

				class="text-input"
				:name="setting.description"
				:placeholder="setting.value"
			/>

			<table v-else-if="setting.type === 'string[]'">
				<tr>
					<th>{{setting.description}}</th>
					<th class="last-column"></th>
					<th class="last-column"></th>
					<th class="last-column"></th>
				</tr>

				<tr v-for="value, i in setting.value">
					<td class="no-padding">
						<input type="text" :value="value" required>
					</td>
					<td class="last-column" @click="popPlainValue(setting, i)">
						<icon name="minus" />
					</td>

					<th class="last-column" @click="movePlainDown(setting, i)">
						<icon name="chevron-down" v-visible="i < setting.value.length - 1" />
					</th>

					<th class="last-column" @click="movePlainUp(setting, i)">
						<icon name="chevron-up" v-visible="i > 0" />
					</th>
				</tr>

				<tr>
					<td class="no-padding">
						<input type="text" required v-model="setting.toPush">
					</td>
					<td class="last-column" @click="pushPlainValue(setting)">
						<icon name="check" />
					</td>
					<th class="last-column"></th>
					<th class="last-column"></th>
				</tr>
			</table>

			<named-textarea
				v-else-if="setting.type === 'string[]'"

				class="text-input"
				:name="setting.description"
				:small="true"
				:placeholder="setting.value.join('\n')"
			/>

			<component v-else-if="setting.type === 'string[][]'">
				<h4>{{setting.description}}</h4>

				<table>
					<tr>
						<th v-for="column in setting.table">{{column}}</th>
						<th class="last-column"></th>
						<th class="last-column"></th>
						<th class="last-column"></th>
					</tr>

					<tr v-for="row, i in setting.value">
						<td v-for="cell in row" class="no-padding">
							<input type="text" :value="cell" required>
						</td>
						<td class="last-column" @click="popValue(setting, row)">
							<icon name="minus" />
						</td>

						<th class="last-column" @click="moveDown(setting, row)">
							<icon name="chevron-down" v-visible="i < setting.value.length - 1" />
						</th>

						<th class="last-column" @click="moveUp(setting, row)">
							<icon name="chevron-up" v-visible="i > 0" />
						</th>
					</tr>

					<tr>
						<td v-for="column, id in setting.table" class="no-padding">
							<input type="text" :placeholder="column" required v-model="setting.toPush[id]">
						</td>
						<td class="last-column" @click="pushValue(setting)">
							<icon name="check" />
						</td>
						<th class="last-column"></th>
						<th class="last-column"></th>
					</tr>
				</table>
			</component>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "./global.sass"

	.theme-settings
		padding: 16px

	.text-input
		margin-top: 16px

	.last-column
		float: right // TODO: fix this

		cursor: pointer
		color: lighten(#803, 10%)
</style>

<script type="text/javascript">
	import Theme from "../../libs/theme.js";

	export default {
		name: "theme-settings",

		methods: {
			// 2D-table -- string[][]
			pushValue(setting) {
				setting.value.push(setting.toPush);

				setting.toPush = [];
				for(let name of setting.table) {
					setting.toPush.push("");
				}
			},
			popValue(setting, row) {
				setting.value.splice(setting.value.indexOf(row), 1);
			},

			moveDown(setting, row) {
				const index = setting.value.indexOf(row);
				if(index !== setting.value.length - 1) { // Not last row
					setting.value.splice(index, 1);
					setting.value.splice(index + 1, 0, row);
				}
			},
			moveUp(setting, row) {
				const index = setting.value.indexOf(row);
				if(index !== 0) { // Not first row
					setting.value.splice(index, 1);
					setting.value.splice(index - 1, 0, row);
				}
			},

			// 1D-table -- string[]
			pushPlainValue(setting) {
				setting.value.push(setting.toPush);
				setting.toPush = "";
			},
			popPlainValue(setting, index) {
				setting.value.splice(index, 1);
			},

			movePlainDown(setting, index) {
				if(index !== setting.value.length - 1) { // Not last row
					const row = setting.value[index];
					setting.value.splice(index, 1);
					setting.value.splice(index + 1, 0, row);
				}
			},
			movePlainUp(setting, index) {
				if(index !== 0) { // Not first row
					const row = setting.value[index];
					setting.value.splice(index, 1);
					setting.value.splice(index - 1, 0, row);
				}
			}
		},

		asyncComputed: {
			settings: {
				async get() {
					const settings = await Theme.getAllSettings();

					return Object.keys(settings)
						.map(name => {
							let setting = settings[name];
							setting.name = name;

							if(setting.type === "string[]") {
								setting.toPush = "";
							} else if(setting.type === "string[][]") {
								setting.toPush = [];
								for(let name of setting.table) {
									setting.toPush.push("");
								}
							}
							return setting;
						});
				},
				default: []
			}
		}
	};
</script>